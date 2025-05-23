// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from 'next/server';
import { OpenAI } from "openai";

// OpenAI istemcisini oluştur
const client = new OpenAI({
	baseURL: "https://router.huggingface.co/nebius/v1",
	apiKey: process.env.HF_TOKEN || "",
});

// Llama 3.1 modeli ile chat tamamlama isteği gönderen fonksiyon
async function generateChatResponse(userMessage) {
	// API anahtarı kontrolü
	if (!process.env.HF_TOKEN) {
		throw new Error("HF_TOKEN environment variable is not set");
	}
	
	try {
		console.log('Sending request to Llama 3.1 model...');
		
		const chatCompletion = await client.chat.completions.create({
			model: "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
			messages: [
				{
					role: "system",
					content: "Sen bir ilaç uzmanı asistansın. İlaçlar, yan etkileri, dozaj bilgileri ve etkileşimleri hakkında bilgi veriyorsun. Yanıtlarını Türkçe olarak ver."
				},
				{
					role: "user",
					content: userMessage,
				},
			],
			temperature: 0.7,
			max_tokens: 500,
		});
		
		console.log('Response received from Llama 3.1');
		return chatCompletion.choices[0].message.content;
	} catch (error) {
		console.error('Error generating chat response:', error);
		throw error;
	}
}

// Hata durumunda kullanılacak basit yanıt
function getErrorResponse(message) {
	return `Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin. (Hata: ${message})`;
}

export async function POST(request) {
	try {
		const body = await request.json();
		const userMessage = body.message || 'Merhaba';

		try {
			// Llama 3.1 modeli ile yanıt oluştur
			const botReply = await generateChatResponse(userMessage);
			
			// Boş yanıt kontrolü
			if (!botReply || botReply.trim().length === 0) {
				console.log('Empty response from model');
				return NextResponse.json({ 
					reply: "Üzgünüm, şu anda yanıt oluşturamıyorum. Lütfen daha sonra tekrar deneyin." 
				}, { status: 200 });
			}
			
			return NextResponse.json({ reply: botReply }, { status: 200 });
		} catch (apiError) {
			console.log('API Error:', apiError.message);
			return NextResponse.json({ 
				reply: getErrorResponse(apiError.message) 
			}, { status: 200 });
		}

	} catch (error) {
		console.error('Error in API route /api/chat/hf:', error);
		
		return NextResponse.json({ 
			reply: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin." 
		}, { status: 200 });
	}
}