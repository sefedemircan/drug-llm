"use client";

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Container, 
  Title, 
  Text, 
  Stack, 
  Paper, 
  Tabs, 
  Notification, 
  useMantineTheme, 
  Box, 
  Divider, 
  Group, 
  Checkbox,
  Anchor,
  ThemeIcon,
  Select,
  NumberInput,
  Textarea,
  MultiSelect
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconAt, 
  IconLock, 
  IconBrandGoogle, 
  IconBrandFacebook, 
  IconUser,
  IconShieldLock,
  IconDeviceLaptop,
  IconAlertCircle,
  IconCalendar,
  IconHeartbeat,
  IconUserCircle
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';

// SearchParams'ı işleyecek component
function AuthPageContent() {
  const theme = useMantineTheme();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  // Responsive tasarım için useMediaQuery ekle
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { login, signup } = useAuth();
  const [step, setStep] = useState(1); // 1: Email/Şifre, 2: Profil, 3: Sağlık

  // Profil formu
  const profileForm = useForm({
    initialValues: {
      fullName: '',
      birthDate: null,
      gender: '',
      height: '',
      weight: '',
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

  // URL parametresi değiştiğinde aktif tabı güncelle
  useEffect(() => {
    if (tabFromUrl === 'signup') {
      setActiveTab('signup');
    } else if (tabFromUrl === 'login') {
      setActiveTab('login');
    }
  }, [tabFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (activeTab === 'login') {
        const result = await login(email, password);
        if (result?.error) {
          setMessage({ type: 'error', content: result.error });
          setLoading(false);
          return;
        }
        if (result?.success) {
          setMessage({ type: 'success', content: result.success });
          // Yönlendirme AuthContext'te yapılıyor
        }
      } else {
        if (step === 1) {
          if (password.length < 6) {
            setMessage({ type: 'error', content: 'Şifre en az 6 karakter olmalıdır' });
            setLoading(false);
            return;
          }
          setStep(2);
          setLoading(false);
          return;
        } else if (step === 2) {
          const profileValidation = profileForm.validate();
          if (profileValidation.hasErrors) {
            setMessage({ type: 'error', content: 'Lütfen tüm zorunlu alanları doldurun' });
            setLoading(false);
            return;
          }
          setStep(3);
          setLoading(false);
          return;
        } else if (step === 3) {
          const healthValidation = healthForm.validate();
          if (healthValidation.hasErrors) {
            setMessage({ type: 'error', content: 'Lütfen tüm zorunlu alanları doldurun' });
            setLoading(false);
            return;
          }

          const profileData = {
            full_name: profileForm.values.fullName,
            birth_date: profileForm.values.birthDate,
            gender: profileForm.values.gender,
            height: profileForm.values.height || null,
            weight: profileForm.values.weight || null,
            phone: profileForm.values.phone,
            address: profileForm.values.address,
            emergency_contact: profileForm.values.emergencyContact
          };

          const healthData = {
            blood_type: healthForm.values.blood_type,
            chronic_diseases: healthForm.values.chronic_diseases,
            current_medications: healthForm.values.current_medications,
            drug_allergies: healthForm.values.drug_allergies,
            food_allergies: healthForm.values.food_allergies,
            medical_history: healthForm.values.medical_history,
            family_history: healthForm.values.family_history,
            lifestyle_info: healthForm.values.lifestyle_info
          };

          const result = await signup(email, password, profileData, healthData);
          if (result?.error) {
            setMessage({ type: 'error', content: result.error });
          } else if (result?.success) {
            setMessage({ type: 'success', content: result.success });
            setStep(1);
            setActiveTab('login');
          }
        }
      }
    } catch (error) {
      console.error(`${activeTab === 'login' ? 'Giriş' : 'Kayıt'} işlemi sırasında beklenmeyen hata:`, error);
      setMessage({ 
        type: 'error', 
        content: `İşlem sırasında bir hata oluştu: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <IconShieldLock size={20} />,
      title: 'Güvenli Erişim',
      description: 'İlaç bilgilerinize güvenli şekilde erişin',
    },
    {
      icon: <IconDeviceLaptop size={20} />,
      title: 'Uyumluluk',
      description: 'Tüm cihazlarınızdan kullanabilirsiniz',
    }
  ];

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

  // Yaygın kullanılan ilaçlar
  const commonMedications = [
    { value: 'Parol', label: 'Parol (Parasetamol)' },
    { value: 'Aspirin', label: 'Aspirin' },
    { value: 'İbuprofen', label: 'İbuprofen' },
    { value: 'Metformin', label: 'Metformin' },
    { value: 'Lisinopril', label: 'Lisinopril' },
    { value: 'Atorvastatin', label: 'Atorvastatin' },
    { value: 'Omeprazol', label: 'Omeprazol' },
    { value: 'Levotiroksin', label: 'Levotiroksin' },
    { value: 'Amlodipin', label: 'Amlodipin' },
    { value: 'Metoprolol', label: 'Metoprolol' },
    { value: 'Sertralin', label: 'Sertralin' },
    { value: 'Alprazolam', label: 'Alprazolam' },
    { value: 'Gabapentin', label: 'Gabapentin' },
    { value: 'Tramadol', label: 'Tramadol' },
    { value: 'Diklofenak', label: 'Diklofenak' },
    { value: 'Ranitidin', label: 'Ranitidin' },
    { value: 'Siprofloksasin', label: 'Siprofloksasin' },
    { value: 'Amoksisilin', label: 'Amoksisilin' },
    { value: 'Azitromisin', label: 'Azitromisin' },
    { value: 'Prednizolon', label: 'Prednizolon' }
  ];

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.primary[0]}, ${theme.colors.neutral[1]})`,
        display: 'flex',
        alignItems: 'center',
        padding: isSmallMobile ? '10px' : (isMobile ? '20px' : '0')
      }}
    >
      <Container size={isMobile ? "xs" : "md"} py={isMobile ? 20 : 40}>
        <Paper
          radius="lg"
          shadow="md"
          p={0} 
          style={{ 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            minHeight: isMobile ? 'auto' : '550px'
          }}
        >
          {/* Sol taraf - bilgi paneli */}
          <Box 
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary[7]}, ${theme.colors.primary[9]})`,
              flex: isMobile ? '1' : '0 0 40%',
              padding: isSmallMobile ? '25px 20px' : (isMobile ? '30px 25px' : '40px 30px'),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
              // Mobilde daha az yükseklik oluştur
              minHeight: isMobile ? '200px' : 'auto'
            }}
          >
            <div>
              <Title order={2} mb={isMobile ? "md" : "xl"}>DrugLLM</Title>
              <Title order={3} mb="md" size={isMobile ? "h4" : "h3"}>İlaç Bilgilerine Anında Erişim</Title>
              
              {!isSmallMobile && (
                <Text mb={isMobile ? "md" : "xl"} opacity={0.8} size={isMobile ? "sm" : "md"}>
                  DrugLLM&apos;e hoş geldiniz! İlaçlar hakkında detaylı bilgilere erişmek için giriş yapın veya yeni bir hesap oluşturun.
                </Text>
              )}
              
              {!isMobile && (
                <Stack spacing="xl" mt={50}>
                  {features.map((feature, index) => (
                    <Group key={index} spacing="md">
                      <ThemeIcon 
                        size={44} 
                        radius="md" 
                        color={theme.colors.secondary[4]}
                        variant="filled"
                      >
                        {feature.icon}
                      </ThemeIcon>
                      <div>
                        <Text weight={700} size="sm">{feature.title}</Text>
                        <Text size="xs" opacity={0.8}>{feature.description}</Text>
                      </div>
                    </Group>
                  ))}
                </Stack>
              )}
            </div>
            
            <div>
              <Button
                component={Link} 
                href="/"
                variant="white"
                color="dark" 
                leftSection={<IconArrowLeft size={16} />}
                size={isMobile ? "xs" : "sm"}
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </Box>
          
          {/* Sağ taraf - form */}
          <Box 
            style={{
              flex: '1',
              padding: isSmallMobile ? '25px 20px' : (isMobile ? '30px 25px' : '40px'),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={setActiveTab}
              classNames={{ 
                tabActive: 'custom-active-tab' 
              }}
              styles={{
                tab: {
                  fontWeight: 500,
                  fontSize: isSmallMobile ? '14px' : '15px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                },
                tabActive: {
                  borderColor: `${theme.colors.primary[6]} !important`
                }
              }}
            >
              <Tabs.List grow mb={isMobile ? "md" : "xl"}>
                <Tabs.Tab value="login">Giriş Yap</Tabs.Tab>
                <Tabs.Tab value="signup">Hesap Oluştur</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="login">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}>
                  <Stack spacing={isMobile ? "md" : "lg"}>
                    <Title 
                      order={2} 
                      mb="md"
                      size={isMobile ? "h3" : "h2"}
                      style={{ 
                        color: theme.colors.primary[8],
                        fontWeight: 600 
                      }}
                    >
                      Hesabınıza Giriş Yapın
                    </Title>
                    
                    {message && (
                      <Notification 
                        color={message.type === 'error' ? 'red' : 'green'} 
                        onClose={() => setMessage(null)}
                        withCloseButton
                        withBorder
                      >
                        {message.content}
                      </Notification>
                    )}

                    <TextInput
                      label="E-posta Adresi"
                      placeholder="ornek@email.com"
                      icon={<IconAt size={16} />}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size={isMobile ? "sm" : "md"}
                      styles={{
                        label: { fontWeight: 500, marginBottom: '6px' }
                      }}
                    />
                    
                    <PasswordInput
                      label="Şifre"
                      placeholder="Şifreniz"
                      icon={<IconLock size={16} />}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size={isMobile ? "sm" : "md"}
                      styles={{
                        label: { fontWeight: 500, marginBottom: '6px' }
                      }}
                    />
                    
                    <Group position="apart" mt="xs">
                      <Checkbox
                        label="Beni hatırla"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.currentTarget.checked)}
                        size="sm"
                      />
                      <Anchor component="button" size="sm">
                        Şifremi unuttum
                      </Anchor>
                    </Group>
                    
                    <Button
                      type="submit"
                      loading={loading}
                      fullWidth
                      mt="md"
                      size={isMobile ? "sm" : "md"}
                      color="primary.6"
                      styles={{
                        root: {
                          boxShadow: `0 4px 14px ${theme.colors.primary[2]}`
                        }
                      }}
                    >
                      Giriş Yap
                    </Button>
                    
                    <Divider
                      label="veya şununla devam edin"
                      labelPosition="center"
                      my="sm"
                    />
                    
                    <Button
                      leftSection={<IconBrandGoogle size={isMobile ? 16 : 18} />}
                      variant="outline"
                      color="primary.6"
                      fullWidth
                      size={isMobile ? "sm" : "md"}
                    >
                      Google ile Giriş Yap
                    </Button>
                    
                    <Text color="dimmed" size={isMobile ? "xs" : "sm"} align="center">
                      Hesabınız yok mu? 
                      <Anchor 
                        component="button" 
                        size={isMobile ? "xs" : "sm"}
                        onClick={() => setActiveTab('signup')}
                      >
                        Hemen kaydolun
                      </Anchor>
                    </Text>
                  </Stack>
                </form>
              </Tabs.Panel>

              <Tabs.Panel value="signup" pt="md">
                <Stack spacing={isMobile ? "md" : "lg"}>
                  <Title 
                    order={2} 
                    mb="md"
                    size={isMobile ? "h3" : "h2"}
                    style={{ 
                      color: theme.colors.primary[8],
                      fontWeight: 600 
                    }}
                  >
                    {step === 1 ? 'Yeni Hesap Oluşturun' : 
                     step === 2 ? 'Profil Bilgileriniz' : 
                     'Sağlık Bilgileriniz'}
                  </Title>
                  
                  {message && (
                    <Notification 
                      color={message.type === 'error' ? 'red' : 'green'} 
                      onClose={() => setMessage(null)}
                      withCloseButton
                      withBorder
                    >
                      {message.content}
                    </Notification>
                  )}

                  {step === 1 && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}>
                      <Stack spacing="md">
                        <TextInput
                          label="E-posta Adresi"
                          placeholder="ornek@email.com"
                          icon={<IconAt size={16} />}
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          size={isMobile ? "sm" : "md"}
                          styles={{
                            label: { fontWeight: 500, marginBottom: '6px' }
                          }}
                        />
                        
                        <PasswordInput
                          label="Şifre"
                          placeholder="Şifreniz"
                          icon={<IconLock size={16} />}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          size={isMobile ? "sm" : "md"}
                          styles={{
                            label: { fontWeight: 500, marginBottom: '6px' }
                          }}
                        />

                        <Button
                          type="submit"
                          loading={loading}
                          fullWidth
                          size={isMobile ? "sm" : "md"}
                          color="primary.6"
                          styles={{
                            root: {
                              boxShadow: `0 4px 14px ${theme.colors.primary[2]}`
                            }
                          }}
                        >
                          Devam Et
                        </Button>
                      </Stack>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}>
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
                            mt="md"
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

                        <Group position="apart" mt="xl">
                          <Button 
                            type="button" 
                            variant="outline" 
                            color="gray"
                            onClick={() => setStep(1)}
                          >
                            Geri
                          </Button>
                          <Button
                            type="submit"
                            loading={loading}
                            size={isMobile ? "sm" : "md"}
                            color="primary.6"
                            styles={{
                              root: {
                                boxShadow: `0 4px 14px ${theme.colors.primary[2]}`
                              }
                            }}
                          >
                            Devam Et
                          </Button>
                        </Group>
                      </Stack>
                    </form>
                  )}

                  {step === 3 && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}>
                      <Stack spacing="md">
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
                            placeholder="Düzenli kullandığınız ilaçları seçin veya yazın"
                            data={commonMedications}
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

                        <Group position="apart" mt="xl">
                          <Button 
                            type="button" 
                            variant="outline" 
                            color="gray"
                            onClick={() => setStep(2)}
                          >
                            Geri
                          </Button>
                          <Button
                            type="submit"
                            loading={loading}
                            size={isMobile ? "sm" : "md"}
                            color="primary.6"
                            styles={{
                              root: {
                                boxShadow: `0 4px 14px ${theme.colors.primary[2]}`
                              }
                            }}
                          >
                            Hesap Oluştur
                          </Button>
                        </Group>
                      </Stack>
                    </form>
                  )}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// Ana component
export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Sayfa yükleniyor" />}>
      <AuthPageContent />
    </Suspense>
  );
} 