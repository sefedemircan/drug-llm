"use client";

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Paper,
  Group,
  Button,
  Accordion,
  Code,
  Stack,
  Grid,
  Card,
  ThemeIcon,
  Alert,
  Anchor,
  List,
  Breadcrumbs
} from '@mantine/core';
import {
  IconBook,
  IconRocket,
  IconShield,
  IconApi,
  IconBulb,
  IconWarning,
  IconExternalLink,
  IconSearch,
  IconPill,
  IconHeartbeat,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function DocsPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Başlangıç',
      icon: <IconRocket size={20} />,
      items: [
        { id: 'introduction', title: 'DrugLLM Nedir?' },
        { id: 'quick-start', title: 'Hızlı Başlangıç' },
        { id: 'account-setup', title: 'Hesap Kurulumu' }
      ]
    },
    {
      id: 'features',
      title: 'Özellikler',
      icon: <IconBulb size={20} />,
      items: [
        { id: 'drug-info', title: 'İlaç Bilgileri' },
        { id: 'interaction-check', title: 'Etkileşim Kontrolü' },
        { id: 'side-effects', title: 'Yan Etki Analizi' },
        { id: 'personalization', title: 'Kişiselleştirme' }
      ]
    },
    {
      id: 'api',
      title: 'API Referansı',
      icon: <IconApi size={20} />,
      items: [
        { id: 'authentication', title: 'Kimlik Doğrulama' },
        { id: 'endpoints', title: 'API Uç Noktaları' },
        { id: 'examples', title: 'Örnek Kullanım' }
      ]
    },
    {
      id: 'safety',
      title: 'Güvenlik',
      icon: <IconShield size={20} />,
      items: [
        { id: 'data-privacy', title: 'Veri Gizliliği' },
        { id: 'disclaimers', title: 'Sorumluluk Reddi' },
        { id: 'best-practices', title: 'En İyi Uygulamalar' }
      ]
    }
  ];

  const breadcrumbItems = [
    { title: 'Ana Sayfa', href: '/' },
    { title: 'Dokümantasyon', href: '/docs' }
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Navbar />
      <Box 
        style={{ 
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          paddingTop: isMobile ? '100px' : '120px'
        }}
      >
        <Container size="xl" py="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

          {/* Header */}
          <Box mb="xl" style={{ textAlign: 'center' }}>
            <Group position="center" mb="md">
              <ThemeIcon size={50} radius="md" variant="light" color="blue">
                <IconBook size={28} />
              </ThemeIcon>
            </Group>
            <Title 
              order={1} 
              mb="md"
              style={{ 
                fontSize: isMobile ? '2rem' : '3rem',
                fontWeight: 800,
                color: 'var(--primary)',
                textAlign: 'center'
              }}
            >
              DrugLLM Dokümantasyonu
            </Title>
            <Text 
              size={isMobile ? "md" : "lg"} 
              color="dimmed" 
              style={{ 
                maxWidth: '600px', 
                margin: '0 auto',
                lineHeight: 1.6 
              }}
            >
              DrugLLM&apos;i kullanmaya başlamak için ihtiyacınız olan her şey burada. 
              API referanslarından güvenlik kılavuzlarına kadar kapsamlı dokümantasyon.
            </Text>
          </Box>

          <Grid>
            {/* Sidebar */}
            <Grid.Col span={isMobile ? 12 : 3}>
              <Paper shadow="sm" radius="md" p="md" style={{ position: 'sticky', top: '140px' }}>
                <Text size="sm" weight={600} mb="md" color="dimmed">
                  İÇERİK
                </Text>
                <Stack spacing="xs">
                  {sections.map((section) => (
                    <Box key={section.id}>
                      <Group 
                        spacing="xs" 
                        style={{ 
                          cursor: 'pointer',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: activeSection === section.id ? 'var(--primary-light)' : 'transparent'
                        }}
                        onClick={() => setActiveSection(section.id)}
                      >
                        {section.icon}
                        <Text size="sm" weight={500}>{section.title}</Text>
                      </Group>
                      {activeSection === section.id && (
                        <Stack spacing={4} ml="xl" mt="xs">
                          {section.items.map((item) => (
                            <Text 
                              key={item.id}
                              size="xs" 
                              color="dimmed"
                              style={{ 
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '4px'
                              }}
                              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                            >
                              {item.title}
                            </Text>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid.Col>

            {/* Main Content */}
            <Grid.Col span={isMobile ? 12 : 9}>
              <Stack spacing="xl">
                
                {/* Başlangıç Bölümü */}
                <Paper shadow="sm" radius="md" p="xl">
                  <Title order={2} mb="lg" id="getting-started">
                    <Group spacing="sm">
                      <IconRocket size={24} color="var(--primary)" />
                      Başlangıç
                    </Group>
                  </Title>

                  <Title order={3} mb="md" id="introduction">DrugLLM Nedir?</Title>
                  <Text mb="lg" style={{ lineHeight: 1.6 }}>
                    DrugLLM, yapay zeka destekli bir ilaç bilgi sistemidir. Kullanıcıların ilaçlar hakkında 
                    güvenilir ve kişiselleştirilmiş bilgiler almasına yardımcı olur. Sistem, Türkiye&apos;deki 
                    ilaç mevzuatına uygun olarak tasarlanmıştır.
                  </Text>

                  <Alert color="yellow" mb="lg">
                    <strong>Önemli:</strong> DrugLLM bir tıbbi tavsiye aracı değildir. 
                    Ciddi sağlık sorunları için mutlaka bir sağlık profesyoneliyle görüşün.
                  </Alert>

                  <Title order={3} mb="md" id="quick-start">Hızlı Başlangıç</Title>
                  <List spacing="sm" mb="lg">
                    <List.Item>
                      <Anchor component={Link} href="/login?tab=signup">
                        Hesap oluşturun
                      </Anchor> ve profil bilgilerinizi tamamlayın
                    </List.Item>
                    <List.Item>Sağlık bilgilerinizi güvenli şekilde kaydedin</List.Item>
                    <List.Item>
                      <Anchor component={Link} href="/chat">
                        Chat sayfasına
                      </Anchor> gidin ve ilaç sorularınızı sorun
                    </List.Item>
                    <List.Item>Kişiselleştirilmiş yanıtlar alın</List.Item>
                  </List>

                  <Title order={3} mb="md" id="account-setup">Hesap Kurulumu</Title>
                  <Text mb="md">
                    Hesap kurulumu 3 adımda tamamlanır:
                  </Text>
                  <Accordion variant="separated">
                    <Accordion.Item value="step1">
                      <Accordion.Control>1. E-posta ve Şifre</Accordion.Control>
                      <Accordion.Panel>
                        E-posta adresinizi ve güçlü bir şifre belirleyin. 
                        E-posta doğrulaması gereklidir.
                      </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="step2">
                      <Accordion.Control>2. Profil Bilgileri</Accordion.Control>
                      <Accordion.Panel>
                        Ad, soyad, doğum tarihi, cinsiyet gibi temel bilgilerinizi girin.
                      </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="step3">
                      <Accordion.Control>3. Sağlık Bilgileri</Accordion.Control>
                      <Accordion.Panel>
                        Kan grubu, alerjiler, mevcut ilaçlar gibi sağlık bilgilerinizi kaydedin.
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Paper>

                {/* Özellikler Bölümü */}
                <Paper shadow="sm" radius="md" p="xl">
                  <Title order={2} mb="lg" id="features">
                    <Group spacing="sm">
                      <IconBulb size={24} color="var(--primary)" />
                      Özellikler
                    </Group>
                  </Title>

                  <Grid>
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card shadow="xs" p="md" radius="md" style={{ height: '100%' }}>
                        <Group spacing="sm" mb="md">
                          <ThemeIcon size={40} radius="md" color="blue" variant="light">
                            <IconPill size={20} />
                          </ThemeIcon>
                          <Title order={4} id="drug-info">İlaç Bilgileri</Title>
                        </Group>
                        <Text size="sm" color="dimmed">
                          Kullandığınız ilaçlar hakkında detaylı bilgiler:
                          etken madde, endikasyonlar, dozaj bilgileri.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card shadow="xs" p="md" radius="md" style={{ height: '100%' }}>
                        <Group spacing="sm" mb="md">
                          <ThemeIcon size={40} radius="md" color="green" variant="light">
                            <IconHeartbeat size={20} />
                          </ThemeIcon>
                          <Title order={4} id="interaction-check">Etkileşim Kontrolü</Title>
                        </Group>
                        <Text size="sm" color="dimmed">
                          Farklı ilaçlar arasındaki potansiyel etkileşimleri 
                          kontrol edin ve güvenli kullanım sağlayın.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card shadow="xs" p="md" radius="md" style={{ height: '100%' }}>
                        <Group spacing="sm" mb="md">
                          <ThemeIcon size={40} radius="md" color="orange" variant="light">
                            <IconAlertTriangle size={20} />
                          </ThemeIcon>
                          <Title order={4} id="side-effects">Yan Etki Analizi</Title>
                        </Group>
                        <Text size="sm" color="dimmed">
                          İlaçların potansiyel yan etkileri hakkında bilgi alın 
                          ve ne zaman doktora başvurmanız gerektiğini öğrenin.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card shadow="xs" p="md" radius="md" style={{ height: '100%' }}>
                        <Group spacing="sm" mb="md">
                          <ThemeIcon size={40} radius="md" color="purple" variant="light">
                            <IconSearch size={20} />
                          </ThemeIcon>
                          <Title order={4} id="personalization">Kişiselleştirme</Title>
                        </Group>
                        <Text size="sm" color="dimmed">
                          Yaşınız, kiliniz, alerjileriniz gibi kişisel bilgilerinize 
                          göre özelleştirilmiş tavsiyeleri alın.
                        </Text>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Paper>

                {/* API Bölümü */}
                <Paper shadow="sm" radius="md" p="xl">
                  <Title order={2} mb="lg" id="api">
                    <Group spacing="sm">
                      <IconApi size={24} color="var(--primary)" />
                      API Referansı
                    </Group>
                  </Title>

                  <Title order={3} mb="md" id="authentication">Kimlik Doğrulama</Title>
                  <Text mb="md">
                    API erişimi için Supabase kimlik doğrulaması kullanılır:
                  </Text>
                  <Code block mb="lg">
{`// Giriş yapma
const { data, error } = await supabase.auth.signInWithPassword({
  email: &apos;user@example.com&apos;,
  password: &apos;password&apos;
});`}
                  </Code>

                  <Title order={3} mb="md" id="endpoints">API Uç Noktaları</Title>
                  <Stack spacing="sm" mb="lg">
                    <Paper p="md" style={{ backgroundColor: '#f8f9fa' }}>
                      <Code>POST /api/chat/hf</Code>
                      <Text size="sm" color="dimmed" mt="xs">
                        Chat mesajı gönderme ve LLM yanıtı alma
                      </Text>
                    </Paper>
                  </Stack>

                  <Title order={3} mb="md" id="examples">Örnek Kullanım</Title>
                  <Code block>
{`// Chat API&apos;sine mesaj gönderme
fetch('/api/chat/hf', {
  method: 'POST',
  headers: {
    &apos;Content-Type&apos;: &apos;application/json&apos;,
  },
  body: JSON.stringify({
    message: &apos;Aspirin hakkında bilgi verebilir misiniz?&apos;,
    userId: &apos;user-id&apos;
  })
});`}
                  </Code>
                </Paper>

                {/* Güvenlik Bölümü */}
                <Paper shadow="sm" radius="md" p="xl">
                  <Title order={2} mb="lg" id="safety">
                    <Group spacing="sm">
                      <IconShield size={24} color="var(--primary)" />
                      Güvenlik ve Gizlilik
                    </Group>
                  </Title>

                  <Alert icon={<IconShield size={16} />} color="blue" mb="lg">
                    Verileriniz Supabase&apos;de güvenli şekilde şifrelenerek saklanır.
                  </Alert>

                  <Title order={3} mb="md" id="data-privacy">Veri Gizliliği</Title>
                  <List spacing="sm" mb="lg">
                    <List.Item>Kişisel verileriniz şifrelenerek saklanır</List.Item>
                    <List.Item>Sağlık bilgileriniz sadece size özel tavsiyelerde kullanılır</List.Item>
                    <List.Item>Verileriniz üçüncü taraflarla paylaşılmaz</List.Item>
                  </List>

                  <Title order={3} mb="md" id="disclaimers">Sorumluluk Reddi</Title>
                  <Text mb="lg" style={{ lineHeight: 1.6 }}>
                    DrugLLM bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. 
                    Ciddi sağlık sorunları için mutlaka bir doktor veya eczacıya danışın.
                  </Text>

                  <Title order={3} mb="md" id="best-practices">En İyi Uygulamalar</Title>
                  <List spacing="sm">
                    <List.Item>Profil bilgilerinizi güncel tutun</List.Item>
                    <List.Item>İlaç değişikliklerini sisteme bildirin</List.Item>
                    <List.Item>Acil durumlar için 112&apos;yi arayın</List.Item>
                    <List.Item>Düzenli doktor kontrollerinizi ihmal etmeyin</List.Item>
                  </List>
                </Paper>

                {/* Alt Bilgi */}
                <Paper shadow="sm" radius="md" p="xl" style={{ backgroundColor: 'var(--primary-light)' }}>
                  <Group position="apart">
                    <Box>
                      <Title order={4} mb="sm">Yardıma mı ihtiyacınız var?</Title>
                      <Text size="sm" color="dimmed">
                        Daha fazla bilgi için bizimle iletişime geçin.
                      </Text>
                    </Box>
                    <Group>
                      <Button 
                        component={Link} 
                        href="/contact" 
                        variant="light"
                      >
                        İletişim
                      </Button>
                      <Button 
                        component={Link} 
                        href="/chat"
                      >
                        Şimdi Deneyin
                      </Button>
                    </Group>
                  </Group>
                </Paper>

              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  );
} 