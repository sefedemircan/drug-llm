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
  MultiSelect,
  Popover
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
import { DateInput, DatePicker, DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';

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
      className="auth-page"
      style={{ 
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--auth-bg)',
        background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(240, 247, 255, 0.95) 50%, rgba(243, 244, 246, 0.8) 100%)',
        overflow: 'hidden'
      }}
    >
      <Container 
        fluid
        className="auth-container"
        style={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '16px 16px' : '24px 24px',
          maxHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Paper
          className="auth-paper"
          shadow="xl"
          radius="xl"
          p={0}
          style={{
            backgroundColor: 'white',
            maxWidth: isMobile ? '100%' : (isSmallMobile ? '320px' : '800px'),
            width: '100%',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            overflow: 'hidden',
            maxHeight: isMobile ? 'calc(100vh - 32px)' : 'calc(100vh - 48px)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <Box 
            style={{ 
              height: '100%',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row'
            }}
          >
            {/* Sol taraf - bilgi paneli */}
            <Box 
              style={{
                background: `linear-gradient(135deg, var(--primary), #0D47A1)`,
                position: 'relative',
                flex: isMobile ? '0 0 180px' : '0 0 40%',
                padding: isSmallMobile ? '20px 16px' : (isMobile ? '24px 20px' : '32px 24px'),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isMobile ? 'center' : 'space-between',
                color: 'white',
                overflow: 'hidden',
                minHeight: isMobile ? '180px' : 'auto'
              }}
            >
              {/* Dekoratif elementler */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }} />
              
              <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '-30px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(9, 109, 217, 0.4)',
                zIndex: 0
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Title 
                  order={2} 
                  mb={isMobile ? "sm" : "xl"}
                  style={{
                    fontSize: isMobile ? '1.6rem' : '2.2rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(to right, #ffffff, #d0e8ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }}
                >
                  DrugLLM
                </Title>
                
                {!isMobile && (
                  <>
                    <Title 
                      order={3} 
                      mb="md" 
                      size={isMobile ? "h4" : "h3"}
                      style={{
                        fontWeight: 700,
                        color: 'white'
                      }}
                    >
                      İlaç Bilgilerine Anında Erişim
                    </Title>
                    
                    <Text mb="xl" opacity={0.9} size="md" style={{ lineHeight: 1.6 }}>
                      DrugLLM&apos;e hoş geldiniz! İlaçlar hakkında detaylı bilgilere erişmek için giriş yapın veya yeni bir hesap oluşturun.
                    </Text>
                    
                    <Stack spacing="xl" mt={50}>
                      {features.map((feature, index) => (
                        <Group key={index} spacing="md">
                          <ThemeIcon 
                            size={44} 
                            radius="md" 
                            color="var(--secondary)"
                            variant="filled"
                            style={{
                              boxShadow: '0 8px 15px rgba(0, 200, 83, 0.25)',
                            }}
                          >
                            {feature.icon}
                          </ThemeIcon>
                          <div>
                            <Text weight={700} size="sm">{feature.title}</Text>
                            <Text size="xs" opacity={0.9}>{feature.description}</Text>
                          </div>
                        </Group>
                      ))}
                    </Stack>
                  </>
                )}
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Button
                  component={Link} 
                  href="/"
                  variant="white"
                  color="dark" 
                  leftSection={<IconArrowLeft size={16} />}
                  size={isMobile ? "xs" : "sm"}
                  style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    opacity: 0.9,
                    '&:hover': {
                      opacity: 1,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Ana Sayfaya Dön
                </Button>
              </div>
            </Box>
            
            {/* Sağ taraf - form */}
            <Box 
              className="auth-form-container"
              style={{
                flex: '1',
                padding: isSmallMobile ? '20px 16px' : (isMobile ? '24px 20px' : '32px'),
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                overflow: 'auto',
                maxHeight: isMobile ? 'calc(100vh - 232px)' : 'calc(100vh - 48px)'
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
                    fontWeight: 600,
                    fontSize: isSmallMobile ? '14px' : '15px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    transition: 'all 0.2s ease',
                    opacity: 0.7,
                    '&:hover': {
                      opacity: 1,
                      backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    }
                  },
                  tabActive: {
                    opacity: 1,
                    borderColor: `var(--primary) !important`
                  }
                }}
              >
                <Tabs.List grow mb={isMobile ? "md" : "lg"}>
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
                          color: 'var(--text-title)',
                          fontWeight: 700,
                          fontSize: isMobile ? '1.5rem' : '1.8rem',
                          letterSpacing: '-0.01em'
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
                          icon={<IconAlertCircle size={18} />}
                          radius="md"
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
                        radius="md"
                        styles={{
                          label: { 
                            fontWeight: 600, 
                            marginBottom: '6px',
                            fontSize: '0.9rem',
                            color: 'var(--text-title)'
                          },
                          input: {
                            '&:focus': {
                              borderColor: 'var(--primary)',
                            }
                          }
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
                        radius="md"
                        styles={{
                          label: { 
                            fontWeight: 600, 
                            marginBottom: '6px',
                            fontSize: '0.9rem',
                            color: 'var(--text-title)'
                          },
                          input: {
                            '&:focus': {
                              borderColor: 'var(--primary)',
                            }
                          }
                        }}
                      />
                      
                      <Group position="apart" mt="xs">
                        <Checkbox
                          label="Beni hatırla"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.currentTarget.checked)}
                          size="sm"
                          styles={{
                            label: { 
                              fontWeight: 500, 
                            }
                          }}
                        />
                        <Anchor 
                          component="button" 
                          size="sm"
                          style={{
                            color: 'var(--primary)',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              textDecoration: 'none',
                              color: 'var(--text-title)',
                            }
                          }}
                        >
                          Şifremi unuttum
                        </Anchor>
                      </Group>
                      
                      <Button
                        type="submit"
                        loading={loading}
                        fullWidth
                        mt="xl"
                        size={isMobile ? "md" : "lg"}
                        className="cta-button"
                        style={{
                          backgroundColor: 'var(--primary)',
                          boxShadow: '0 8px 15px rgba(25, 118, 210, 0.25)',
                          border: 'none',
                          height: isMobile ? '42px' : '48px',
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                          marginTop: '20px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'var(--primary)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 20px rgba(25, 118, 210, 0.35)',
                          }
                        }}
                      >
                        Giriş Yap
                      </Button>
                      
                      <Divider
                        label="veya şununla devam edin"
                        labelPosition="center"
                        my="sm"
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.85rem'
                        }}
                      />
                      
                      <Button
                        leftSection={<IconBrandGoogle size={isMobile ? 16 : 18} />}
                        variant="outline"
                        fullWidth
                        size={isMobile ? "md" : "lg"}
                        radius="md"
                        style={{
                          borderColor: '#EAEEF5',
                          color: 'var(--text-body)',
                          height: isMobile ? '42px' : '48px',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#F5F9FF',
                            borderColor: 'var(--primary-light)',
                          }
                        }}
                      >
                        Google ile Giriş Yap
                      </Button>
                      
                      <Text color="dimmed" size={isMobile ? "xs" : "sm"} align="center" mt="md">
                        Hesabınız yok mu? 
                        <Anchor 
                          component="button" 
                          size={isMobile ? "xs" : "sm"}
                          onClick={() => setActiveTab('signup')}
                          style={{
                            marginLeft: '5px',
                            color: 'var(--primary)',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              textDecoration: 'none',
                              color: 'var(--text-title)',
                            }
                          }}
                        >
                          Hemen kaydolun
                        </Anchor>
                      </Text>
                    </Stack>
                  </form>
                </Tabs.Panel>

                <Tabs.Panel value="signup" pt="md">
                  <Box
                    style={{
                      height: 'auto',
                      maxHeight: isMobile ? 'calc(100vh - 350px)' : 'calc(100vh - 200px)',
                      overflow: 'auto',
                      paddingRight: '8px'
                    }}
                  >
                    <Stack spacing={isMobile ? "sm" : "md"}>
                      <Title 
                        order={2} 
                        mb="md"
                        size={isMobile ? "h3" : "h2"}
                        style={{ 
                          color: 'var(--text-title)',
                          fontWeight: 700,
                          fontSize: isMobile ? '1.3rem' : '1.6rem',
                          letterSpacing: '-0.01em'
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
                          icon={<IconAlertCircle size={18} />}
                          radius="md"
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
                              radius="md"
                              styles={{
                                label: { 
                                  fontWeight: 600, 
                                  marginBottom: '6px',
                                  fontSize: '0.9rem',
                                  color: 'var(--text-title)'
                                },
                                input: {
                                  '&:focus': {
                                    borderColor: 'var(--primary)',
                                  }
                                }
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
                              radius="md"
                              styles={{
                                label: { 
                                  fontWeight: 600, 
                                  marginBottom: '6px',
                                  fontSize: '0.9rem',
                                  color: 'var(--text-title)'
                                },
                                input: {
                                  '&:focus': {
                                    borderColor: 'var(--primary)',
                                  }
                                }
                              }}
                            />

                            <Button
                              type="submit"
                              loading={loading}
                              fullWidth
                              size={isMobile ? "md" : "lg"}
                              className="cta-button"
                              style={{
                                backgroundColor: 'var(--primary)',
                                boxShadow: '0 8px 15px rgba(25, 118, 210, 0.25)',
                                border: 'none',
                                height: isMobile ? '42px' : '48px',
                                fontWeight: 600,
                                letterSpacing: '0.3px',
                                marginTop: '20px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: 'var(--primary)',
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 12px 20px rgba(25, 118, 210, 0.35)',
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
                            <Paper 
                              shadow="xs" 
                              p="md" 
                              withBorder 
                              mb="lg"
                              style={{
                                borderRadius: '10px',
                                border: '1px solid var(--border-color-light)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                              }}
                            >
                              <Title 
                                order={4} 
                                mb="md"
                                style={{
                                  color: 'var(--text-title)',
                                  fontWeight: 700,
                                  fontSize: '1.1rem'
                                }}
                              >Temel Bilgiler</Title>
                              
                              <TextInput
                                label="Ad Soyad"
                                placeholder="Ad ve soyadınızı girin"
                                required
                                radius="md"
                                {...profileForm.getInputProps('fullName')}
                                styles={{
                                  label: { 
                                    fontWeight: 600, 
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-title)'
                                  },
                                  input: {
                                    '&:focus': {
                                      borderColor: 'var(--primary)',
                                    }
                                  }
                                }}
                              />
                              
                              <DatePickerInput
                                label="Doğum Tarihi"
                                placeholder="Doğum tarihinizi seçin"
                                maxDate={new Date()}
                                radius="md"
                                mt="md"
                                clearable={false}
                                firstDayOfWeek={1}
                                icon={<IconCalendar size={16} color="#1976d2" />}
                                valueFormat="DD.MM.YYYY"
                                {...profileForm.getInputProps('birthDate')}
                                styles={{
                                  input: {
                                    height: '42px',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    '&:focus': {
                                      borderColor: 'var(--primary)',
                                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                    }
                                  },
                                  label: { 
                                    fontWeight: 600, 
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-title)'
                                  },
                                  calendarHeaderControl: {
                                    color: 'var(--primary)'
                                  },
                                  day: {
                                    '&[dataSelected]': {
                                      backgroundColor: 'var(--primary)'
                                    }
                                  },
                                  month: {
                                    '&[dataSelected]': {
                                      backgroundColor: 'var(--primary)'
                                    }
                                  },
                                  year: {
                                    '&[dataSelected]': {
                                      backgroundColor: 'var(--primary)'
                                    }
                                  }
                                }}
                                popoverProps={{ withinPortal: true }}
                                locale="tr"
                              />
                              
                              <Select
                                label="Cinsiyet"
                                placeholder="Cinsiyetinizi seçin"
                                required
                                radius="md"
                                data={[
                                  { value: 'Erkek', label: 'Erkek' },
                                  { value: 'Kadın', label: 'Kadın' },
                                  { value: 'Diğer', label: 'Diğer' }
                                ]}
                                {...profileForm.getInputProps('gender')}
                                mt="md"
                                styles={{
                                  label: { 
                                    fontWeight: 600, 
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-title)'
                                  },
                                  input: {
                                    '&:focus': {
                                      borderColor: 'var(--primary)',
                                    }
                                  }
                                }}
                              />
                              
                              <Group grow mt="md">
                                <NumberInput
                                  label="Boy (cm)"
                                  placeholder="Boyunuzu girin"
                                  min={0}
                                  max={250}
                                  radius="md"
                                  {...profileForm.getInputProps('height')}
                                  styles={{
                                    label: { 
                                      fontWeight: 600, 
                                      marginBottom: '6px',
                                      fontSize: '0.9rem',
                                      color: 'var(--text-title)'
                                    },
                                    input: {
                                      '&:focus': {
                                        borderColor: 'var(--primary)',
                                      }
                                    }
                                  }}
                                />
                                
                                <NumberInput
                                  label="Kilo (kg)"
                                  placeholder="Kilonuzu girin"
                                  min={0}
                                  max={300}
                                  radius="md"
                                  {...profileForm.getInputProps('weight')}
                                  styles={{
                                    label: { 
                                      fontWeight: 600, 
                                      marginBottom: '6px',
                                      fontSize: '0.9rem',
                                      color: 'var(--text-title)'
                                    },
                                    input: {
                                      '&:focus': {
                                        borderColor: 'var(--primary)',
                                      }
                                    }
                                  }}
                                />
                              </Group>
                            </Paper>
                            
                            <Paper 
                              shadow="xs" 
                              p="md" 
                              withBorder 
                              mb="lg"
                              style={{
                                borderRadius: '10px',
                                border: '1px solid var(--border-color-light)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                              }}
                            >
                              <Title 
                                order={4} 
                                mb="md"
                                style={{
                                  color: 'var(--text-title)',
                                  fontWeight: 700,
                                  fontSize: '1.1rem'
                                }}
                              >İletişim Bilgileri</Title>
                              
                              <TextInput
                                label="Telefon"
                                placeholder="Telefon numaranızı girin"
                                required
                                radius="md"
                                {...profileForm.getInputProps('phone')}
                                styles={{
                                  label: { 
                                    fontWeight: 600, 
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-title)'
                                  },
                                  input: {
                                    '&:focus': {
                                      borderColor: 'var(--primary)',
                                    }
                                  }
                                }}
                              />
                              
                              <TextInput
                                label="Adres"
                                placeholder="Adresinizi girin"
                                required
                                radius="md"
                                {...profileForm.getInputProps('address')}
                                mt="md"
                                styles={{
                                  label: { 
                                    fontWeight: 600, 
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-title)'
                                  },
                                  input: {
                                    '&:focus': {
                                      borderColor: 'var(--primary)',
                                    }
                                  }
                                }}
                              />
                            </Paper>
                            
                            <Paper 
                              shadow="xs" 
                              p="md" 
                              withBorder 
                              mb="lg"
                              style={{
                                borderRadius: '10px',
                                border: '1px solid var(--border-color-light)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                              }}
                            >
                              <Title 
                                order={4} 
                                mb="md"
                                style={{
                                  color: 'var(--text-title)',
                                  fontWeight: 700,
                                  fontSize: '1.1rem'
                                }}
                              >Acil Servis Bilgileri</Title>
                              
                              <TextInput
                                label="Acil Servis Kişisi"
                                placeholder="Acil servis kişisi veya ilişkininiz"
                                required
                                radius="md"
                                {...profileForm.getInputProps('emergencyContact')}
                                styles={{
                                  label: { 
                                    fontWeight: 600, 
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-title)'
                                  },
                                  input: {
                                    '&:focus': {
                                      borderColor: 'var(--primary)',
                                    }
                                  }
                                }}
                              />
                            </Paper>

                            <Group position="apart" mt="xl">
                              <Button 
                                type="button" 
                                variant="outline" 
                                color="gray"
                                radius="md"
                                onClick={() => setStep(1)}
                                style={{
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-body)',
                                  fontWeight: 500,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: '#F5F9FF',
                                    borderColor: 'var(--primary-light)',
                                  }
                                }}
                              >
                                Geri
                              </Button>
                              <Button
                                type="submit"
                                loading={loading}
                                size={isMobile ? "md" : "lg"}
                                className="cta-button"
                                style={{
                                  backgroundColor: 'var(--primary)',
                                  boxShadow: '0 8px 15px rgba(25, 118, 210, 0.25)',
                                  border: 'none',
                                  height: isMobile ? '42px' : '48px',
                                  fontWeight: 600,
                                  letterSpacing: '0.3px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: 'var(--primary)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 12px 20px rgba(25, 118, 210, 0.35)',
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
                                size={isMobile ? "md" : "lg"}
                                className="cta-button"
                                style={{
                                  backgroundColor: 'var(--primary)',
                                  boxShadow: '0 8px 15px rgba(25, 118, 210, 0.25)',
                                  border: 'none',
                                  height: isMobile ? '42px' : '48px',
                                  fontWeight: 600,
                                  letterSpacing: '0.3px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: 'var(--primary)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 12px 20px rgba(25, 118, 210, 0.35)',
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
                  </Box>
                </Tabs.Panel>
              </Tabs>
            </Box>
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