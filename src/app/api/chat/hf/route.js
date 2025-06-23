// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from 'next/server';
import { OpenAI } from "openai";
import { createClient } from '@supabase/supabase-js';

// OpenAI istemcisini oluştur
const client = new OpenAI({
	//baseURL: "https://router.huggingface.co/nebius/v1",
	//baseURL: "https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3.3-70B-Instruct/v1",
	baseURL: "https://openrouter.ai/api/v1",
	//apiKey: process.env.HF_TOKEN || "",
	apiKey: process.env.OPENROUTER_API_KEY || "",
});

// Supabase istemcisini oluştur
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
			console.error('❌ Error details:', error.message);
			console.error('❌ Error code:', error.code);
			return null;
		}

		console.log('✅ Profile data query successful');
		console.log('✅ Profile data found:', !!data && data.length > 0);
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
			console.error('❌ Error details:', error.message);
			console.error('❌ Error code:', error.code);
			return null;
		}

		console.log('✅ Health data query successful');
		console.log('✅ Health data found:', !!data && data.length > 0);
		return data && data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error('❌ Exception in getHealthInfo:', error);
		return null;
	}
}

// System prompt oluşturma fonksiyonu
function createSystemPrompt(profileData = null, healthData = null) {
	const hasUserData = profileData || healthData;
	
	return `Senin adın DrugLLM, Türkiye'deki ilaç mevzuatına uygun, bilimsel ve güvenilir bilgiler veriyorsun.

${hasUserData ? '🔹 BU KULLANICININ KİŞİSEL BİLGİLERİ MEVCUT - MUTLAKA DİKKATE AL!' : '🔸 Bu kullanıcının kişisel bilgileri mevcut değil - genel bilgi ver.'}

KİŞİLİĞİN VE YAKLAŞIMIN:
- Empatik, sabırlı ve anlayışlı
- Bilimsel verilere dayalı objektif yaklaşım
- Kullanıcının endişelerini ciddiye alan
- Kompleks tıbbi konuları anlaşılır şekilde açıklayan
- Kişisel bilgilere sahip olduğunda bunları uygun şekilde kullanarak kişiselleştirilmiş yanıtlar veren
- Doğal ve akıcı konuşma tarzı

YANITLAMA PRİNSİPLERİ:
1. **Güvenlik Öncelikli**: Her zaman güvenliği ön planda tut
2. **Kanıta Dayalı**: Sadece bilimsel verilerle desteklenen bilgileri paylaş
3. **Kişiselleştirilmiş**: Kullanıcının profil bilgilerini dikkate al
4. **Doğal İletişim**: Formal başlıklar kullanmak zorunda değilsin, konuşma tarzında yanıt ver
5. **Uyarı Odaklı**: Kritik durumları açıkça belirt ama doğal bir şekilde
6. **Kişisel Bilgi Entegrasyonu**: Kullanıcı hakkında sorular sorduğunda mevcut bilgileri kullan

## KİŞİSEL SORULARA YANITLAMA:
Kullanıcı kendisi hakkında sorular sorduğunda (yaşım kaç, kilom ne, hangi ilaçları kullanıyorum vb.):
- Mevcut profil ve sağlık bilgilerini kullan
- Bilgi eksikse nazikçe belirt
- Güvenlik ve mahremiyet için hassas verileri koruyarak yanıt ver
- Gerekiyorsa bilgilerin güncellenmesini öner

## YANITLAMA TARZI:
- Samimi ve sıcak bir üslup kullan
- Kişisel bilgileri doğal bir şekilde konuşmaya entegre et
- İlaç sorularında gerekli detayları ver ama katı başlıklar kullanma
- Uyarıları doğal cümle yapısı içinde belirt
- Kullanıcının durumuna özel öneriler ver
- Emojileri ölçülü kullan, abartma

KULLANICI PROFIL BİLGİLERİ:
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

ÖZEL TALİMATLAR:
- Kullanıcı kendi bilgilerini sorduğunda yukarıdaki verileri doğal bir şekilde kullan
- Eğer kullanıcının alerjisi varsa, uyarıları konuşma içinde doğal olarak belirt
- Kronik hastalıkları olan kullanıcılar için özel dikkat göster
- Yaşlı kullanıcılar (65+) için dozaj ayarlaması gerektiğini belirt
- Hamilelik/emzirme durumunda ekstra dikkatli ol
- Acil durumları tanı ve hemen doktora yönlendir
- Kişisel bilgi sorularında mevcut verileri doğrudan paylaş
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

// Llama 3.1 modeli ile chat tamamlama isteği gönderen fonksiyon
async function generateChatResponse(userMessage, chatHistory = [], profileData = null, healthData = null) {
	// API anahtarı kontrolü
	if (!process.env.HF_TOKEN) {
		throw new Error("HF_TOKEN environment variable is not set");
	}
	
	try {
		console.log('Sending request to Llama 3.1 model...');
		
		// Chat geçmişini mesaj formatına çevir
		const messages = [
			{
				role: "system",
				content: createSystemPrompt(profileData, healthData)
			}
		];

		// Chat geçmişini ekle (eğer varsa)
		if (chatHistory && chatHistory.length > 0) {
			// Sistem mesajını atla (zaten yukarıda eklendi)
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
		
		const chatCompletion = await client.chat.completions.create({
			//model: "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
			//model:"meta-llama/Llama-3.3-70B-Instruct",
			//model:"deepseek/deepseek-r1-distill-llama-70b:free",
			model:"meta-llama/llama-4-maverick:free",
			messages: messages,
			temperature: 0.7,
			max_tokens: 1000,
		});
		
		console.log('✅ Response received from AI model');
		const responseContent = chatCompletion.choices[0]?.message?.content;
		
		if (!responseContent || responseContent.trim().length === 0) {
			console.error('❌ Empty response from AI model');
			throw new Error('Empty response from AI model');
		}
		
		console.log('📝 AI Response length:', responseContent.length);
		return responseContent;
	} catch (error) {
		console.error('❌ Error generating chat response:', error);
		throw error;
	}
}

// Hata durumunda kullanılacak basit yanıt
function getErrorResponse(message) {
	return `Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin. (Hata: ${message})`;
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

		console.log('=== API DEBUG ===');
		console.log('Received message:', userMessage);
		console.log('Received userId:', userId);
		console.log('Received sessionId:', sessionId);
		console.log('Received profileData:', !!frontendProfileData);
		console.log('Received healthData:', !!frontendHealthData);

		// Kullanıcı verilerini Supabase'den çek
		let supabaseProfileData = null;
		let supabaseHealthData = null;

		if (userId) {
			console.log('✅ UserID mevcut, kullanıcı verilerini çekiyorum...');
			console.log('Fetching user data for userId:', userId);
			
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

		// Debug için: eğer veri yoksa test verisi ekle
		if (!finalProfileData && !finalHealthData) {
			console.log('⚠️ No user data found, model will respond without personalization');
		}

		console.log('🎯 Final profile data source:', supabaseProfileData ? 'Supabase' : (frontendProfileData ? 'Frontend' : 'None'));
		console.log('🎯 Final health data source:', supabaseHealthData ? 'Supabase' : (frontendHealthData ? 'Frontend' : 'None'));

		try {
			// Debug: System prompt'u logla
			//const systemPrompt = createSystemPrompt(finalProfileData, finalHealthData);
			//console.log('Generated system prompt length:', systemPrompt.length);
			//console.log('Has user data for prompt:', !!(finalProfileData || finalHealthData));
			
			// Llama 3.1 modeli ile yanıt oluştur (chat geçmişini de gönder)
			const botReply = await generateChatResponse(userMessage, chatHistory, finalProfileData, finalHealthData);
			
			// Boş yanıt kontrolü
			if (!botReply || botReply.trim().length === 0) {
				console.log('❌ Empty response from model');
				return NextResponse.json({ 
					reply: "Üzgünüm, şu anda yanıt oluşturamıyorum. Lütfen daha sonra tekrar deneyin." 
				}, { status: 200 });
			}
			
			console.log('✅ Bot reply generated successfully, length:', botReply.length);
			console.log('📄 Bot reply preview:', botReply.substring(0, 200) + '...');
			
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