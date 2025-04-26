"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import { 
  Box, 
  Container, 
  Title, 
  TextInput, 
  NumberInput,
  Select, 
  Button, 
  Group, 
  Divider, 
  Stack,
  Textarea,
  Text,
  LoadingOverlay,
  Alert,
  Code,
  Tabs,
  Paper,
  MultiSelect
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { IconAlertCircle, IconCalendar, IconHeartbeat, IconUser, IconUserCircle } from '@tabler/icons-react';
import { tr } from 'date-fns/locale';

// Kan grupları
const bloodTypes = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: '0+', label: '0+' },
  { value: '0-', label: '0-' },
  { value: 'Bilinmiyor', label: 'Bilinmiyor' }
];

// Yaygın kronik hastalıklar
const commonChronicDiseases = [
  { value: 'Hipertansiyon', label: 'Hipertansiyon (Yüksek Tansiyon)' },
  { value: 'Diyabet', label: 'Diyabet (Şeker Hastalığı)' },
  { value: 'Astım', label: 'Astım' },
  { value: 'KOAH', label: 'KOAH (Kronik Obstrüktif Akciğer Hastalığı)' },
  { value: 'Kalp Hastalığı', label: 'Kalp Hastalığı' },
  { value: 'Tiroid Bozukluğu', label: 'Tiroid Bozukluğu' },
  { value: 'Artrit', label: 'Artrit (Eklem İltihabı)' },
  { value: 'Depresyon', label: 'Depresyon' },
  { value: 'Anksiyete', label: 'Anksiyete' },
  { value: 'Migren', label: 'Migren' },
  { value: 'Epilepsi', label: 'Epilepsi' }
];

// Yaygın ilaç alerjileri
const commonDrugAllergies = [
  { value: 'Penisilin', label: 'Penisilin' },
  { value: 'Sefalosporin', label: 'Sefalosporin' },
  { value: 'Sülfamidler', label: 'Sülfamidler' },
  { value: 'Aspirin', label: 'Aspirin' },
  { value: 'NSAIDs', label: 'NSAIDs (Steroid olmayan anti-inflamatuar ilaçlar)' },
  { value: 'Antibiyotikler', label: 'Antibiyotikler (genel)' }
];

// Yaygın gıda alerjileri
const commonFoodAllergies = [
  { value: 'Süt', label: 'Süt ve Süt Ürünleri' },
  { value: 'Yumurta', label: 'Yumurta' },
  { value: 'Fıstık', label: 'Fıstık' },
  { value: 'Kabuklu Yemişler', label: 'Kabuklu Yemişler' },
  { value: 'Buğday', label: 'Buğday/Gluten' },
  { value: 'Soya', label: 'Soya' },
  { value: 'Balık', label: 'Balık' }
];

// Sağlık bilgileri için API fonksiyonları
const healthInfoService = {
  // Kullanıcının sağlık bilgilerini getir
  getUserHealthInfo: async () => {
    try {
      const { data, error } = await supabase
        .from('health_info')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sağlık bilgileri alınırken hata:', error);
      return { data: null, error };
    }
  },

  // Sağlık bilgilerini oluştur
  createHealthInfo: async (healthData) => {
    try {
      healthData.created_at = new Date();
      healthData.updated_at = new Date();
      
      const { data, error } = await supabase
        .from('health_info')
        .insert(healthData)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sağlık bilgileri oluşturulurken hata:', error);
      return { data: null, error };
    }
  },

  // Sağlık bilgilerini güncelle
  updateHealthInfo: async (id, healthData) => {
    try {
      healthData.updated_at = new Date();
      
      const { data, error } = await supabase
        .from('health_info')
        .update(healthData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sağlık bilgileri güncellenirken hata:', error);
      return { data: null, error };
    }
  },

  // Sağlık bilgilerini sil
  deleteHealthInfo: async (id) => {
    try {
      const { error } = await supabase
        .from('health_info')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sağlık bilgileri silinirken hata:', error);
      return { error };
    }
  },
  
  // Sağlık bilgilerini oluştur veya güncelle
  upsertHealthInfo: async (healthData) => {
    try {
      // Önce kullanıcının mevcut bir kaydı var mı diye kontrol edelim
      const { data: existingData } = await healthInfoService.getUserHealthInfo();
      
      if (existingData) {
        // Kayıt varsa güncelle
        return await healthInfoService.updateHealthInfo(existingData.id, healthData);
      } else {
        // Kayıt yoksa yeni bir tane oluştur
        return await healthInfoService.createHealthInfo(healthData);
      }
    } catch (error) {
      console.error('Sağlık bilgileri işlenirken hata:', error);
      return { data: null, error };
    }
  }
};

// Profil bilgileri için API fonksiyonları
const profileService = {
  // Kullanıcının profil bilgilerini getir
  getUserProfile: async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Profil bilgileri alınırken hata:', error);
      return { data: null, error };
    }
  },

  // Profil bilgilerini oluştur
  createUserProfile: async (profileData) => {
    try {
      profileData.created_at = new Date();
      profileData.updated_at = new Date();
      
      const { data, error } = await supabase
        .from('user_profile')
        .insert(profileData)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Profil bilgileri oluşturulurken hata:', error);
      return { data: null, error };
    }
  },

  // Profil bilgilerini güncelle
  updateUserProfile: async (id, profileData) => {
    try {
      profileData.updated_at = new Date();
      
      const { data, error } = await supabase
        .from('user_profile')
        .update(profileData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Profil bilgileri güncellenirken hata:', error);
      return { data: null, error };
    }
  },

  // Profil bilgilerini sil
  deleteUserProfile: async (id) => {
    try {
      const { error } = await supabase
        .from('user_profile')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Profil bilgileri silinirken hata:', error);
      return { error };
    }
  },
  
  // Profil bilgilerini oluştur veya güncelle
  upsertUserProfile: async (profileData) => {
    try {
      // Önce kullanıcının mevcut bir kaydı var mı diye kontrol edelim
      const { data: existingData } = await profileService.getUserProfile();
      
      if (existingData) {
        // Kayıt varsa güncelle
        return await profileService.updateUserProfile(existingData.id, profileData);
      } else {
        // Kayıt yoksa yeni bir tane oluştur
        return await profileService.createUserProfile(profileData);
      }
    } catch (error) {
      console.error('Profil bilgileri işlenirken hata:', error);
      return { data: null, error };
    }
  }
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [healthSaveLoading, setHealthSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [healthError, setHealthError] = useState(null);
  const [healthSuccess, setHealthSuccess] = useState(null);
  const [userInfoId, setUserInfoId] = useState(null);
  const [healthInfoId, setHealthInfoId] = useState(null);
  const [loadingStep, setLoadingStep] = useState("başlatılıyor");
  const [activeTab, setActiveTab] = useState('profile');

  // Profil formu
  const profileForm = useForm({
    initialValues: {
      fullName: '',
      birthDate: null,
      gender: '',
      height: '',
      weight: '',
      email: '',
      phone: '',
      address: '',
      emergencyContact: ''
    },
    validate: {
      fullName: (value) => value.trim().length < 3 ? 'Ad soyad en az 3 karakter olmalıdır' : null,
      gender: (value) => !value ? 'Cinsiyet seçiniz' : null,
      height: (value) => value && (isNaN(value) || value <= 0) ? 'Geçerli bir boy giriniz' : null,
      weight: (value) => value && (isNaN(value) || value <= 0) ? 'Geçerli bir kilo giriniz' : null
    },
  });

  // Sağlık bilgileri formu
  const healthForm = useForm({
    initialValues: {
      blood_type: '',
      chronic_diseases: [],
      current_medications: [],
      drug_allergies: [],
      food_allergies: [],
      medical_history: '',
      family_history: '',
      lifestyle_info: ''
    },
    validate: {
      blood_type: (value) => !value ? 'Kan grubu seçiniz' : null,
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, router]);

  // Tüm kullanıcı verilerini çekme
  const fetchUserData = async () => {
    try {
      // Kullanıcı giriş yapmış mı kontrol ediyoruz
      if (!user || !user.id) {
        setError("Oturum bilgisi alınamadı, lütfen tekrar giriş yapın");
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      
      // Önce profil bilgilerini çekelim
      await fetchProfileInfo();
      
      // Sonra sağlık bilgilerini çekelim
      await fetchHealthInfo();
      
      setPageLoading(false);
    } catch (error) {
      console.error("Kullanıcı verileri alınırken hata:", error);
      setError("Kullanıcı verileri alınamadı: " + (error.message || 'Bilinmeyen hata'));
      setPageLoading(false);
    }
  };

  // Profil bilgilerini çekme
  const fetchProfileInfo = async () => {
    try {
      setLoadingStep("profil bilgileri sorgulanıyor");

      console.log("Kullanıcı bilgilerini sorguluyorum...");
      
      // Kullanıcının profil bilgilerini çek
      const { data: profileData, error: profileError } = await profileService.getUserProfile();
      
      if (profileError) {
        console.error("Profil bilgileri alınırken hata:", profileError);
        setError("Profil bilgileri alınamadı: " + profileError.message);
        return;
      }
      
      if (profileData) {
        console.log("Profil bilgileri bulundu. ID:", profileData.id);
        setUserInfoId(profileData.id);
        
        // Formu dolduruyoruz
        profileForm.setValues({
          fullName: profileData.full_name || '',
          birthDate: profileData.birth_date ? new Date(profileData.birth_date) : null,
          gender: profileData.gender || '',
          height: profileData.height || '',
          weight: profileData.weight || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          emergencyContact: profileData.emergency_contact || ''
        });
      } else {
        console.log("Profil bilgileri bulunamadı, boş form gösterilecek");
      }
    } catch (error) {
      console.error("Profil bilgileri alınırken hata:", error);
      setError("Profil bilgileri alınamadı: " + (error.message || 'Bilinmeyen hata'));
    }
  };

  // Sağlık bilgilerini çekme
  const fetchHealthInfo = async () => {
    try {
      setLoadingStep("sağlık bilgileri sorgulanıyor");
      
      // Kullanıcının sağlık bilgilerini çek
      const { data: healthInfoData, error: healthInfoError } = await healthInfoService.getUserHealthInfo();
      
      if (healthInfoError) {
        console.error("Sağlık bilgileri alınırken hata:", healthInfoError);
        setHealthError("Sağlık bilgileri alınamadı: " + healthInfoError.message);
        return;
      }
      
      if (healthInfoData) {
        console.log("Sağlık bilgileri bulundu. ID:", healthInfoData.id);
        setHealthInfoId(healthInfoData.id);
        
        // Formu doldur
        healthForm.setValues({
          blood_type: healthInfoData.blood_type || '',
          chronic_diseases: healthInfoData.chronic_diseases || [],
          current_medications: healthInfoData.current_medications || [],
          drug_allergies: healthInfoData.drug_allergies || [],
          food_allergies: healthInfoData.food_allergies || [],
          medical_history: healthInfoData.medical_history || '',
          family_history: healthInfoData.family_history || '',
          lifestyle_info: healthInfoData.lifestyle_info || ''
        });
      } else {
        console.log("Sağlık bilgileri bulunamadı, boş form gösterilecek");
      }
    } catch (error) {
      console.error("Sağlık bilgileri alınırken hata:", error);
      setHealthError("Sağlık bilgileri alınamadı: " + (error.message || 'Bilinmeyen hata'));
    }
  };

  // Profil formu gönderme işlemi
  const handleProfileSubmit = async (values) => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccess(null);
      
      const profileData = {
        user_id: user.id,
        full_name: values.fullName,
        birth_date: values.birthDate,
        gender: values.gender,
        height: values.height || null,
        weight: values.weight || null,
        email: values.email,
        phone: values.phone,
        address: values.address,
        emergency_contact: values.emergencyContact,
        updated_at: new Date()
      };
      
      // Profil bilgilerini oluştur veya güncelle
      const { data, error } = await profileService.upsertUserProfile(profileData);
      
      if (error) {
        throw new Error('Profil bilgileri kaydedilirken hata: ' + error.message);
      }
      
      if (data && data[0]) {
        setUserInfoId(data[0].id);
      }
      
      setSuccess('Profil bilgileriniz başarıyla güncellendi');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      setError('Profil güncellenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setSaveLoading(false);
    }
  };

  // Sağlık bilgileri formu gönderme işlemi
  const handleHealthSubmit = async (values) => {
    try {
      setHealthSaveLoading(true);
      setHealthError(null);
      setHealthSuccess(null);
      
      // Veritabanına uygun şekilde verileri hazırla
      const healthData = {
        user_id: user.id,
        blood_type: values.blood_type,
        chronic_diseases: values.chronic_diseases,
        current_medications: values.current_medications,
        drug_allergies: values.drug_allergies,
        food_allergies: values.food_allergies,
        medical_history: values.medical_history,
        family_history: values.family_history,
        lifestyle_info: values.lifestyle_info
      };
      
      // Bilgileri kaydet veya güncelle
      const { data, error } = await healthInfoService.upsertHealthInfo(healthData);
      
      if (error) {
        throw new Error('Sağlık bilgileri kaydedilirken hata: ' + error.message);
      }
      
      if (data && data[0]) {
        setHealthInfoId(data[0].id);
      }
      
      setHealthSuccess('Sağlık bilgileriniz başarıyla kaydedildi');
    } catch (error) {
      console.error('Sağlık bilgileri kaydedilirken hata:', error);
      setHealthError('Sağlık bilgileri kaydedilirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setHealthSaveLoading(false);
    }
  };

  if (loading || !user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Container size="md" py="xl">
      <LoadingOverlay visible={pageLoading} label={`Yükleniyor (${loadingStep})`} />
      
      <Title order={2} mb="md">Kullanıcı Bilgilerim</Title>
      <Text color="dimmed" mb="xl">
        Bu bilgiler ilaç tavsiyelerini kişiselleştirmek ve olası etkileşimleri önlemek için kullanılacaktır. 
        Bilgileriniz güvenli şekilde saklanacak ve izniniz olmadan paylaşılmayacaktır.
      </Text>
      
      <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profil Bilgileri
          </Tabs.Tab>
          <Tabs.Tab value="health" leftSection={<IconHeartbeat size={16} />}>
            Sağlık Bilgileri
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Hata" color="red" mb="md">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert title="Başarılı" color="green" mb="md">
              {success}
            </Alert>
          )}
          
          <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
            <Stack spacing="md">
              <Paper shadow="xs" p="md" withBorder mb="lg">
                <Title order={4} mb="md">Temel Bilgiler</Title>
                
                <TextInput
                  label="Ad Soyad"
                  placeholder="Ad ve soyadınızı girin"
                  required
                  {...profileForm.getInputProps('fullName')}
                />
                
                <DateInput
                  label="Doğum Tarihi"
                  placeholder="Doğum tarihinizi seçin"
                  valueFormat="DD.MM.YYYY"
                  maxDate={new Date()}
                  {...profileForm.getInputProps('birthDate')}
                  mt="md"
                />
                
                <Select
                  label="Cinsiyet"
                  placeholder="Cinsiyetinizi seçin"
                  required
                  data={[
                    { value: 'Erkek', label: 'Erkek' },
                    { value: 'Kadın', label: 'Kadın' },
                    { value: 'Diğer', label: 'Diğer' }
                  ]}
                  {...profileForm.getInputProps('gender')}
                  mt="md"
                />
                
                <Group grow mt="md">
                  <NumberInput
                    label="Boy (cm)"
                    placeholder="Boyunuzu girin"
                    min={0}
                    max={250}
                    {...profileForm.getInputProps('height')}
                  />
                  
                  <NumberInput
                    label="Kilo (kg)"
                    placeholder="Kilonuzu girin"
                    min={0}
                    max={300}
                    {...profileForm.getInputProps('weight')}
                  />
                </Group>
              </Paper>
              
              <Paper shadow="xs" p="md" withBorder mb="lg">
                <Title order={4} mb="md">İletişim Bilgileri</Title>
                
                <TextInput
                  label="E-posta"
                  placeholder="E-posta adresinizi girin"
                  required
                  {...profileForm.getInputProps('email')}
                />
                
                <TextInput
                  label="Telefon"
                  placeholder="Telefon numaranızı girin"
                  required
                  {...profileForm.getInputProps('phone')}
                />
                
                <TextInput
                  label="Adres"
                  placeholder="Adresinizi girin"
                  required
                  {...profileForm.getInputProps('address')}
                />
              </Paper>
              
              <Paper shadow="xs" p="md" withBorder mb="lg">
                <Title order={4} mb="md">Acil Servis Bilgileri</Title>
                
                <TextInput
                  label="Acil Servis Kişisi"
                  placeholder="Acil servis kişisi veya ilişkininiz"
                  required
                  {...profileForm.getInputProps('emergencyContact')}
                />
              </Paper>
              
              <Group position="right" mt="md">
                <Button 
                  type="button" 
                  variant="outline" 
                  color="gray"
                  onClick={() => router.push('/chat')}
                >
                  İptal
                </Button>
                <Button type="submit" loading={saveLoading}>
                  Kaydet
                </Button>
              </Group>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="health" pt="md">
          {healthError && (
            <Alert icon={<IconAlertCircle size={16} />} title="Hata" color="red" mb="md">
              {healthError}
            </Alert>
          )}
          
          {healthSuccess && (
            <Alert title="Başarılı" color="green" mb="md">
              {healthSuccess}
            </Alert>
          )}
          
          <form onSubmit={healthForm.onSubmit(handleHealthSubmit)}>
            <Paper shadow="xs" p="md" withBorder mb="lg">
              <Title order={4} mb="md">Temel Sağlık Bilgileri</Title>
              
              <Select
                label="Kan Grubu"
                placeholder="Kan grubunuzu seçin"
                data={bloodTypes}
                withAsterisk
                {...healthForm.getInputProps('blood_type')}
                mb="md"
              />
              
              <MultiSelect
                label="Kronik Hastalıklar"
                placeholder="Varsa kronik hastalıklarınızı seçin veya yazın"
                data={commonChronicDiseases}
                searchable
                clearable
                nothingFoundMessage="Sonuç bulunamadı..."
                {...healthForm.getInputProps('chronic_diseases')}
                mb="md"
              />
              
              <MultiSelect
                label="Kullandığınız İlaçlar"
                placeholder="Düzenli kullandığınız ilaçları yazın"
                data={[]}
                searchable
                clearable
                nothingFoundMessage="Sonuç bulunamadı..."
                hidePickedOptions
                {...healthForm.getInputProps('current_medications')}
                mb="md"
              />
            </Paper>
            
            <Paper shadow="xs" p="md" withBorder mb="lg">
              <Title order={4} mb="md">Alerjiler</Title>
              
              <MultiSelect
                label="İlaç Alerjileri"
                placeholder="Varsa ilaç alerjilerinizi seçin veya yazın"
                data={commonDrugAllergies}
                searchable
                clearable
                nothingFoundMessage="Sonuç bulunamadı..."
                {...healthForm.getInputProps('drug_allergies')}
                mb="md"
              />
              
              <MultiSelect
                label="Gıda Alerjileri"
                placeholder="Varsa gıda alerjilerinizi seçin veya yazın"
                data={commonFoodAllergies}
                searchable
                clearable
                nothingFoundMessage="Sonuç bulunamadı..."
                {...healthForm.getInputProps('food_allergies')}
                mb="md"
              />
            </Paper>
            
            <Paper shadow="xs" p="md" withBorder mb="lg">
              <Title order={4} mb="md">Sağlık Geçmişi</Title>
              
              <Textarea
                label="Tıbbi Geçmiş"
                placeholder="Önemli hastalıklar, geçirdiğiniz ameliyatlar veya tedaviler"
                autosize
                minRows={3}
                {...healthForm.getInputProps('medical_history')}
                mb="md"
              />
              
              <Textarea
                label="Aile Sağlık Geçmişi"
                placeholder="Ailenizde bulunan önemli hastalıklar"
                autosize
                minRows={3}
                {...healthForm.getInputProps('family_history')}
                mb="md"
              />
              
              <Textarea
                label="Yaşam Tarzı Bilgileri"
                placeholder="Sigara, alkol kullanımı, egzersiz düzeni vb."
                autosize
                minRows={3}
                {...healthForm.getInputProps('lifestyle_info')}
              />
            </Paper>
            
            <Group position="right" mt="xl">
              <Button 
                type="button" 
                variant="outline" 
                color="gray"
                onClick={() => setActiveTab('profile')}
              >
                Geri
              </Button>
              <Button type="submit" loading={healthSaveLoading}>
                Kaydet
              </Button>
            </Group>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 