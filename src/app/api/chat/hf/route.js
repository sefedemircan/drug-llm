// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from 'next/server';
import { OpenAI } from "openai";
import { createClient } from '@supabase/supabase-js';

// OpenAI istemcisini oluştur
const client = new OpenAI({
	baseURL: "https://router.huggingface.co/nebius/v1",
	apiKey: process.env.HF_TOKEN || "",
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
			.single();

		if (error) {
			console.error('❌ Error fetching user profile:', error);
			console.error('❌ Error details:', error.message);
			console.error('❌ Error code:', error.code);
			return null;
		}

		console.log('✅ Profile data query successful');
		console.log('✅ Profile data found:', !!data);
		return data;
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
			.single();

		if (error) {
			console.error('❌ Error fetching health info:', error);
			console.error('❌ Error details:', error.message);
			console.error('❌ Error code:', error.code);
			return null;
		}

		console.log('✅ Health data query successful');
		console.log('✅ Health data found:', !!data);
		return data;
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
		const userId = body.userId || null;
		const frontendProfileData = body.profileData || null;
		const frontendHealthData = body.healthData || null;

		console.log('=== API DEBUG ===');
		console.log('Received message:', userMessage);
		console.log('Received userId:', userId);
		console.log('UserId type:', typeof userId);
		console.log('Frontend profile data:', frontendProfileData);
		console.log('Frontend health data:', frontendHealthData);

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
			
			// Debug: Çekilen verileri logla
			if (supabaseProfileData) {
				console.log('✅ Supabase Profile data:', JSON.stringify(supabaseProfileData, null, 2));
			} else {
				console.log('❌ Supabase Profile data is null/undefined');
			}
			if (supabaseHealthData) {
				console.log('✅ Supabase Health data:', JSON.stringify(supabaseHealthData, null, 2));
			} else {
				console.log('❌ Supabase Health data is null/undefined');
			}
		} else {
			console.log('❌ UserID yok, genel prompt kullanılacak');
			console.log('No userId provided, using default prompt');
		}

		// Supabase verisi varsa onu kullan, yoksa frontend'den gelen veriyi kullan
		const finalProfileData = supabaseProfileData || frontendProfileData;
		const finalHealthData = supabaseHealthData || frontendHealthData;

		console.log('🎯 Final profile data source:', supabaseProfileData ? 'Supabase' : (frontendProfileData ? 'Frontend' : 'None'));
		console.log('🎯 Final health data source:', supabaseHealthData ? 'Supabase' : (frontendHealthData ? 'Frontend' : 'None'));

		try {
			// Debug: System prompt'u logla
			const systemPrompt = createSystemPrompt(finalProfileData, finalHealthData);
			console.log('Generated system prompt length:', systemPrompt.length);
			console.log('Has user data for prompt:', !!(finalProfileData || finalHealthData));
			if (finalProfileData || finalHealthData) {
				console.log('✅ Kişisel bilgilerle prompt oluşturuldu');
			} else {
				console.log('❌ Genel prompt oluşturuldu');
			}
			console.log('System prompt preview:', systemPrompt.substring(0, 500) + '...');
			
			// Llama 3.1 modeli ile yanıt oluştur
			const botReply = await generateChatResponse(userMessage, finalProfileData, finalHealthData);
			
			// Boş yanıt kontrolü
			if (!botReply || botReply.trim().length === 0) {
				console.log('Empty response from model');
				return NextResponse.json({ 
					reply: "Üzgünüm, şu anda yanıt oluşturamıyorum. Lütfen daha sonra tekrar deneyin." 
				}, { status: 200 });
			}
			
			console.log('✅ Bot reply generated successfully');
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