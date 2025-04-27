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
  ThemeIcon
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconAt, 
  IconLock, 
  IconBrandGoogle, 
  IconBrandFacebook, 
  IconUser,
  IconShieldLock,
  IconDeviceLaptop
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import LoadingSpinner from '../../components/LoadingSpinner';

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
      console.log(`${activeTab === 'login' ? 'Giriş' : 'Kayıt'} işlemi başlatılıyor...`);
      
      if (activeTab === 'login') {
        const result = await login(email, password);
        if (result?.error) {
          console.error('Giriş hatası:', result.error);
          setMessage({ type: 'error', content: result.error });
        }
      } else {
        if (password.length < 6) {
          setMessage({ type: 'error', content: 'Şifre en az 6 karakter olmalıdır' });
          setLoading(false);
          return;
        }
        
        console.log('Kayıt işlemi için AuthContext.signup çağrılıyor');
        const result = await signup(email, password);
        console.log('Kayıt sonucu:', result);
        
        if (result?.error) {
          console.error('Kayıt hatası:', result.error);
          setMessage({ type: 'error', content: result.error });
        } else if (result?.success) {
          console.log('Kayıt başarılı:', result.success);
          setMessage({ type: 'success', content: result.success });
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

              <form onSubmit={handleSubmit}>
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
                    {activeTab === 'login' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
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
                  
                  {activeTab === 'login' && (
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
                  )}
                  
                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    mt="md"
                    size={isMobile ? "sm" : "md"}
                    color={activeTab === 'login' ? 'primary.6' : 'secondary.6'}
                    styles={{
                      root: {
                        boxShadow: `0 4px 14px ${activeTab === 'login' 
                          ? theme.colors.primary[2] 
                          : theme.colors.secondary[2]}`
                      }
                    }}
                  >
                    {activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                  </Button>
                  
                  <Divider
                    label="veya şununla devam edin"
                    labelPosition="center"
                    my="sm"
                  />
                  
                  <Button
                    leftSection={<IconBrandGoogle size={isMobile ? 16 : 18} />}
                    variant="outline"
                    color={activeTab === 'login' ? 'primary.6' : 'secondary.6'}
                    fullWidth
                    size={isMobile ? "sm" : "md"}
                  >
                    Google ile {activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                  </Button>
                  
                  <Text color="dimmed" size={isMobile ? "xs" : "sm"} align="center">
                    {activeTab === 'login' 
                      ? 'Hesabınız yok mu? '
                      : 'Zaten hesabınız var mı? '}
                    <Anchor 
                      component="button" 
                      size={isMobile ? "xs" : "sm"}
                      onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                    >
                      {activeTab === 'login' ? 'Hemen kaydolun' : 'Giriş yapın'}
                    </Anchor>
                  </Text>
                </Stack>
              </form>
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