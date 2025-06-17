// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from 'next/server';
import { OpenAI } from "openai";

// OpenAI istemcisini oluştur
const client = new OpenAI({
	baseURL: "https://router.huggingface.co/nebius/v1",
	apiKey: process.env.HF_TOKEN || "",
});

// Yaş hesaplama fonksiyonu
function calculateAge(birthDate) {
	if (!birthDate) return null;
	const today = new Date();
	const birth = new Date(birthDate);
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

// System prompt oluşturma fonksiyonu
function createSystemPrompt(profileData = null, healthData = null) {
	return `Senin adın DrugLLM, Türkiye'deki ilaç mevzuatına uygun, bilimsel ve güvenilir bilgiler veriyorsun.

KİŞİLİĞİN VE YAKLAŞIMIN:
- Empatik, sabırlı ve anlayışlı
- Bilimsel verilere dayalı objektif yaklaşım
- Kullanıcının endişelerini ciddiye alan
- Kompleks tıbbi konuları anlaşılır şekilde açıklayan

YANITLAMA PRİNSİPLERİ:
1. **Güvenlik Öncelikli**: Her zaman güvenliği ön planda tut
2. **Kanıta Dayalı**: Sadece bilimsel verilerle desteklenen bilgileri paylaş
3. **Kişiselleştirilmiş**: Kullanıcının profil bilgilerini dikkate al
4. **Yapılandırılmış**: Bilgiyi organize et ve net başlıklar kullan
5. **Uyarı Odaklı**: Kritik durumları açıkça belirt

## CEVAP FORMATI:
Her yanıtını şu yapıda organize et:

🔍 ANA BİLGİ
[İlacın temel bilgileri, kullanım alanları]

⚠️ ÖNEMLİ UYARILAR
[Yan etkiler, kontrendikasyonlar, özel durumlar]

💊 DOZAJ VE KULLANIM
[Yaş/kilo bazlı dozaj, kullanım şekli, zamanlaması]

🔄 ETKİLEŞİMLER
[Diğer ilaçlar, gıdalar, alkol ile etkileşimler]

👨‍⚕️ DOKTOR TAVSİYESİ
[Ne zaman doktora başvurulmalı]

KULLANICI PROFIL BİLGİLERİ:
${profileData ? `
- Yaş: ${calculateAge(profileData.birth_date) || 'Belirtilmemiş'}
- Cinsiyet: ${profileData.gender || 'Belirtilmemiş'}
- Kilo: ${profileData.weight || 'Belirtilmemiş'} kg
- Boy: ${profileData.height || 'Belirtilmemiş'} cm
` : '- Profil bilgisi mevcut değil'}

${healthData ? `
SAĞLIK BİLGİLERİ:
- Kan Grubu: ${healthData.blood_type || 'Belirtilmemiş'}
- Kronik Hastalıklar: ${healthData.chronic_diseases?.join(', ') || 'Yok'}
- Mevcut İlaçlar: ${healthData.current_medications?.join(', ') || 'Yok'}
- İlaç Alerjileri: ${healthData.drug_allergies?.join(', ') || 'Yok'}
- Gıda Alerjileri: ${healthData.food_allergies?.join(', ') || 'Yok'}
` : '- Sağlık bilgisi mevcut değil'}

ÖZEL TALİMATLAR:
- Eğer kullanıcının alerjisi varsa, mutlaka kontrol et ve uyar
- Kronik hastalıkları olan kullanıcılar için özel dikkat göster
- Yaşlı kullanıcılar (65+) için dozaj ayarlaması öner
- Hamilelik/emzirme durumunda ekstra dikkatli ol
- Acil durumları tanı ve hemen doktora yönlendir

YASAKLAR:
- Kesin tanı koyma
- Reçete yazma
- Doktor yerine geçme
- Kanıtlanmamış bilgi verme
- Alternatif tıp önerileri

Şimdi kullanıcının sorusunu bu rehbere göre yanıtla:`;
}

// Llama 3.1 modeli ile chat tamamlama isteği gönderen fonksiyon
async function generateChatResponse(userMessage, profileData = null, healthData = null) {
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
					content: createSystemPrompt(profileData, healthData)
				},
				{
					role: "user",
					content: userMessage,
				},
			],
			temperature: 0.7,
			max_tokens: 1000,
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
		const profileData = body.profileData || null;
		const healthData = body.healthData || null;

		try {
			// Llama 3.1 modeli ile yanıt oluştur
			const botReply = await generateChatResponse(userMessage, profileData, healthData);
			
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