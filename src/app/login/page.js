"use client";

import { useState, useEffect } from 'react';
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

export default function AuthPage() {
  const theme = useMantineTheme();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
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
      if (activeTab === 'login') {
        const result = await login(email, password);
        if (result?.error) {
          setMessage({ type: 'error', content: result.error });
        }
      } else {
        const result = await signup(email, password);
        if (result?.error) {
          setMessage({ type: 'error', content: result.error });
        } else if (result?.success) {
          setMessage({ type: 'success', content: result.success });
        }
      }
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
        alignItems: 'center'
      }}
    >
      <Container size="md" py={40}>
        <Paper
          radius="lg"
          shadow="md"
          p={0} 
          style={{ 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            minHeight: '550px'
          }}
        >
          {/* Sol taraf - bilgi paneli */}
          <Box 
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary[7]}, ${theme.colors.primary[9]})`,
              flex: '0 0 40%',
              padding: '40px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white'
            }}
          >
            <div>
              <Title order={2} mb="xl">DrugLLM</Title>
              <Title order={3} mb="md">İlaç Bilgilerine Anında Erişim</Title>
              <Text mb="xl" opacity={0.8}>
                DrugLLM&apos;e hoş geldiniz! İlaçlar hakkında detaylı bilgilere erişmek için giriş yapın veya yeni bir hesap oluşturun.
              </Text>
              
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
            </div>
            
            <div>
              <Button
                component={Link} 
                href="/"
                variant="white"
                color="dark" 
                leftSection={<IconArrowLeft size={16} />}
                size="sm"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </Box>
          
          {/* Sağ taraf - form */}
          <Box 
            style={{
              flex: '1 1 60%',
              padding: '40px',
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
                  fontSize: '15px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                },
                tabActive: {
                  borderColor: `${theme.colors.primary[6]} !important`
                }
              }}
            >
              <Tabs.List grow mb="xl">
                <Tabs.Tab value="login">Giriş Yap</Tabs.Tab>
                <Tabs.Tab value="signup">Hesap Oluştur</Tabs.Tab>
              </Tabs.List>

              <form onSubmit={handleSubmit}>
                <Stack spacing="lg">
                  <Title 
                    order={2} 
                    mb="md" 
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
                    size="md"
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
                    size="md"
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
                    size="md"
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
                    leftSection={<IconBrandGoogle size={18} />}
                    variant="outline"
                    color={activeTab === 'login' ? 'primary.6' : 'secondary.6'}
                    fullWidth
                    size="md"
                    styles={{
                      root: {
                        boxShadow: `0 4px 14px ${activeTab === 'login' 
                          ? theme.colors.primary[2] 
                          : theme.colors.secondary[2]}`
                      }
                    }}
                  >
                    Google ile {activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                  </Button>
                  
                  <Text color="dimmed" size="sm" align="center">
                    {activeTab === 'login' 
                      ? 'Hesabınız yok mu? '
                      : 'Zaten hesabınız var mı? '}
                    <Anchor 
                      component="button" 
                      size="sm" 
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