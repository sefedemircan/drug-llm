import { NextResponse } from 'next/server';
import { OpenAI } from "openai";
import { createClient } from '@supabase/supabase-js';

// Supabase istemcisini oluştur
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// OpenAI istemcisini oluştur (OpenRouter API ile)
const client = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPENROUTER_API_KEY || "",
});

// Yaş hesaplama fonksiyonu
function calculateAge(birthDate) {
	if (!birthDate) return null;
	
	const birth = new Date(birthDate);
	const now = new Date();
	const diffTime = Math.abs(now - birth);
	const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
	
	return diffYears;
}

// Kullanıcı profil bilgilerini Supabase'den çek
async function getUserProfile(userId) {
	try {
		console.log('📋 getUserProfile çağrıldı, userId:', userId);
		
		const { data, error } = await supabase
			.from('user_profile')
			.select('*')
			.eq('user_id', userId)
			.limit(1);

		if (error) {
			console.error('❌ Error fetching user profile:', error);
			return null;
		}

		console.log('✅ Profile data query successful');
		return data && data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error('❌ Exception in getUserProfile:', error);
		return null;
	}
}

// Kullanıcı sağlık bilgilerini Supabase'den çek
async function getHealthInfo(userId) {
	try {
		console.log('🏥 getHealthInfo çağrıldı, userId:', userId);
		
		const { data, error } = await supabase
			.from('health_info')
			.select('*')
			.eq('user_id', userId)
			.limit(1);

		if (error) {
			console.error('❌ Error fetching health info:', error);
			return null;
		}

		console.log('✅ Health data query successful');
		return data && data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error('❌ Exception in getHealthInfo:', error);
		return null;
	}
}

// System prompt oluşturucu fonksiyon
function createSystemPrompt(profileData = null, healthData = null) {
	return `Sen ilaçlar konusunda uzman, güvenilir ve samimi bir AI asistanısın. İsmín DrugLLM ve Türkçe konuşuyorsun.

KULLANICI BİLGİLERİ:
${profileData ? `- İsim: ${profileData.full_name || 'Belirtilmemiş'}
- Yaş: ${calculateAge(profileData.birth_date) || 'Belirtilmemiş'}
- Cinsiyet: ${profileData.gender || 'Belirtilmemiş'}  
- Kilo: ${profileData.weight || 'Belirtilmemiş'} kg
- Boy: ${profileData.height || 'Belirtilmemiş'} cm
- E-posta: ${profileData.email || 'Belirtilmemiş'}
- Telefon: ${profileData.phone || 'Belirtilmemiş'}` : '- Profil bilgisi mevcut değil'}

${healthData ? `SAĞLIK BİLGİLERİ:
- Kan Grubu: ${healthData.blood_type || 'Belirtilmemiş'}
- Kronik Hastalıklar: ${healthData.chronic_diseases?.join(', ') || 'Yok'}
- Mevcut İlaçlar: ${healthData.current_medications?.join(', ') || 'Yok'}
- İlaç Alerjileri: ${healthData.drug_allergies?.join(', ') || 'Yok'}
- Gıda Alerjileri: ${healthData.food_allergies?.join(', ') || 'Yok'}
- Tıbbi Geçmiş: ${healthData.medical_history || 'Belirtilmemiş'}
- Aile Geçmişi: ${healthData.family_history || 'Belirtilmemiş'}
- Yaşam Tarzı: ${healthData.lifestyle_info || 'Belirtilmemiş'}` : '- Sağlık bilgisi mevcut değil'}

GÖREVLERIN:
1. İlaç bilgileri sağlamak (etki, doz, yan etkiler, kontrendikasyonlar)
2. İlaç etkileşimlerini kontrol etmek
3. Kişiye özel uyarılar vermek (yaş, cinsiyet, hastalık, diğer ilaçlar)
4. Sağlık sorularını yanıtlamak
5. Semptom bilgilerini değerlendirmek

YANITLAMA TARZI:
- Samimi ve anlayışlı bir dil kullan
- Kullanıcının adını biliyorsan kullan
- Kişisel bilgileri dikkate al
- Basit ve anlaşılır açıkla
- Bilgi eksikse "Bu bilgi profil verinizde mevcut değil" şeklinde belirt
- Yanıtlarında doğal bir konuşma akışı kullan, formal başlıklar kullanma

YASAKLAR:
- Kesin tanı koyma
- Reçete yazma
- Doktor yerine geçme
- Kanıtlanmamış bilgi verme
- Alternatif tıp önerileri
- Kişisel verileri güvenlik dışı paylaşma
- Katı format başlıkları kullanma (🔍 ANA BİLGİ, ⚠️ ÖNEMLİ UYARILAR gibi)
- Robot gibi yanıt verme

ÖRNEK YANITLAMA TARZI:
❌ Kötü: "🔍 ANA BİLGİ: Aspirin ağrı kesicidir. ⚠️ ÖNEMLİ UYARILAR: Yan etkiler..."
✅ İyi: "Aspirin gerçekten etkili bir ağrı kesici. Sizin yaşınızda genelde günde 500mg güvenli, ama mevcut ilaçlarınızla etkileşim olabilir mi kontrol edelim..."

ÖNEMLİ: Eğer kullanıcının profil ve sağlık bilgileri mevcutsa, yanıtında mutlaka bu bilgileri dikkate al ve gerekli uyarıları doğal bir şekilde yap. Özellikle ilaç alerjileri ve kronik hastalıklar için özel dikkat göster. Kullanıcı kendisi hakkında sorular sorduğunda mevcut bilgileri kullanarak samimi ve doğal bir yanıt ver.

Şimdi kullanıcının sorusunu bu rehbere göre yanıtla:`;
}

// Chat session'ından mesajları çek
async function getChatHistory(sessionId) {
	try {
		if (!sessionId || sessionId.toString().startsWith('new')) {
			return [];
		}

		const { data: messages, error } = await supabase
			.from('chat_messages')
			.select('*')
			.eq('session_id', sessionId)
			.order('created_at', { ascending: true });

		if (error) {
			console.error('❌ Chat geçmişi çekilemedi:', error);
			return [];
		}

		console.log(`📜 Session ${sessionId} için ${messages?.length || 0} mesaj çekildi`);
		return messages || [];
	} catch (error) {
		console.error('❌ Chat geçmişi çekilirken hata:', error);
		return [];
	}
}

export async function POST(request) {
	try {
		const body = await request.json();
		const userMessage = body.message || 'Merhaba';
		const userId = body.userId || null;
		const sessionId = body.sessionId || null;
		const frontendProfileData = body.profileData || null;
		const frontendHealthData = body.healthData || null;

		console.log('=== STREAMING API DEBUG ===');
		console.log('Received message:', userMessage);
		console.log('Received userId:', userId);
		console.log('Received sessionId:', sessionId);

		// Kullanıcı verilerini Supabase'den çek
		let supabaseProfileData = null;
		let supabaseHealthData = null;

		if (userId) {
			console.log('✅ UserID mevcut, kullanıcı verilerini çekiyorum...');
			
			// Paralel olarak profil ve sağlık bilgilerini çek
			const [userProfile, userHealthInfo] = await Promise.all([
				getUserProfile(userId),
				getHealthInfo(userId)
			]);

			supabaseProfileData = userProfile;
			supabaseHealthData = userHealthInfo;

			console.log('Supabase Profile data fetched:', supabaseProfileData ? 'Yes' : 'No');
			console.log('Supabase Health data fetched:', supabaseHealthData ? 'Yes' : 'No');
		}

		// Chat geçmişini çek
		const chatHistory = await getChatHistory(sessionId);

		// Supabase verisi varsa onu kullan, yoksa frontend'den gelen veriyi kullan
		const finalProfileData = supabaseProfileData || frontendProfileData;
		const finalHealthData = supabaseHealthData || frontendHealthData;

		console.log('🎯 Final profile data source:', supabaseProfileData ? 'Supabase' : (frontendProfileData ? 'Frontend' : 'None'));
		console.log('🎯 Final health data source:', supabaseHealthData ? 'Supabase' : (frontendHealthData ? 'Frontend' : 'None'));

		// Chat geçmişini mesaj formatına çevir
		const messages = [
			{
				role: "system",
				content: createSystemPrompt(finalProfileData, finalHealthData)
			}
		];

		// Chat geçmişini ekle (eğer varsa)
		if (chatHistory && chatHistory.length > 0) {
			const conversationMessages = chatHistory
				.filter(msg => msg.role !== 'system' || msg.content !== 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?')
				.map(msg => ({
					role: msg.role === 'system' ? 'assistant' : msg.role,
					content: msg.content
				}));
			
			messages.push(...conversationMessages);
			console.log(`✅ Chat geçmişinden ${conversationMessages.length} mesaj eklendi`);
		}

		// Son kullanıcı mesajını ekle
		messages.push({
			role: "user",
			content: userMessage,
		});

		console.log(`📤 Toplam ${messages.length} mesaj gönderiliyor`);

		// Streaming response oluştur
		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			async start(controller) {
				try {
					console.log('🌊 Starting streaming response...');
					
					const stream = await client.chat.completions.create({
						model: "meta-llama/llama-4-maverick:free",
						messages: messages,
						temperature: 0.7,
						max_tokens: 1000,
						stream: true
					});

					let fullResponse = '';

					for await (const chunk of stream) {
						const content = chunk.choices[0]?.delta?.content || '';
						if (content) {
							fullResponse += content;
							
							// Stream chunk'ını gönder
							const data = JSON.stringify({
								type: 'chunk',
								content: content,
								fullContent: fullResponse
							});
							
							controller.enqueue(encoder.encode(`data: ${data}\n\n`));
						}
					}

					// Stream tamamlandığında final mesajı gönder
					const finalData = JSON.stringify({
						type: 'complete',
						content: fullResponse,
						fullContent: fullResponse
					});
					
					controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
					controller.close();

				} catch (error) {
					console.error('❌ Streaming error:', error);
					
					const errorData = JSON.stringify({
						type: 'error',
						content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
						error: error.message
					});
					
					controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
					controller.close();
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});

	} catch (error) {
		console.error('❌ Error in streaming API route:', error);
		
		return NextResponse.json({ 
			error: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
			details: error.message 
		}, { status: 500 });
	}
} 