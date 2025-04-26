"use client";

import { Button, Container, Title, Text, Group, Card, SimpleGrid, Box, ThemeIcon, Divider, Badge, Grid, BackgroundImage, Center, useMantineTheme, Accordion, Avatar, Footer, Stack } from '@mantine/core';
import { IconPill, IconStethoscope, IconHeartbeat, IconSearch, IconRobot, IconShield, IconCloudComputing, IconDeviceMobile, IconChevronRight, IconBrandTwitter, IconBrandFacebook, IconBrandInstagram, IconBrandYoutube, IconQuestionMark, IconStar, IconUser, IconMessage } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const theme = useMantineTheme();
  
  // Sayfa yüklendiğinde scroll pozisyonunu en üste getir
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <IconPill size={24} />,
      title: 'İlaç Bilgisi',
      description: 'Kullandığınız ilaçlar hakkında detaylı bilgiler edinebilirsiniz.'
    },
    {
      icon: <IconStethoscope size={24} />,
      title: 'Yan Etki Analizi',
      description: 'İlaçların potansiyel yan etkileri hakkında bilgi alabilirsiniz.'
    },
    {
      icon: <IconHeartbeat size={24} />,
      title: 'Etkileşim Kontrolü',
      description: 'Farklı ilaçlar arasındaki etkileşimleri kontrol edebilirsiniz.'
    },
    {
      icon: <IconSearch size={24} />,
      title: 'Akıllı Arama',
      description: 'İlaç ismi veya etken madde ile arama yapabilirsiniz.'
    }
  ];

  const technologies = [
    {
      icon: <IconRobot size={24} />, 
      title: "Yapay Zeka",
      description: "En güncel yapay zeka teknolojileri ile ilaç bilgilerine erişim"
    },
    {
      icon: <IconShield size={24} />, 
      title: "Güvenilir Bilgi",
      description: "Resmi kaynaklardan doğrulanmış ilaç bilgileri"
    },
    {
      icon: <IconCloudComputing size={24} />, 
      title: "Gerçek Zamanlı",
      description: "Anlık güncellenen ilaç veritabanı"
    },
    {
      icon: <IconDeviceMobile size={24} />, 
      title: "Mobil Uyumlu",
      description: "Tüm cihazlardan erişilebilen arayüz"
    }
  ];

  const faqs = [
    {
      question: 'DrugLLM nasıl çalışır?',
      answer: 'DrugLLM, büyük dil modelleri ve yapay zeka teknolojisini kullanarak ilaçlar hakkında güncel bilgileri işleyip anlaşılır şekilde sunar. Sistem, güvenilir tıbbi kaynakları kullanarak doğru bilgileri sağlar.'
    },
    {
      question: 'DrugLLM\'i hangi cihazlarda kullanabilirim?',
      answer: 'DrugLLM web tabanlı bir uygulama olduğu için bilgisayar, tablet ve akıllı telefonlar dahil olmak üzere internet bağlantısı olan tüm cihazlarınızdan erişebilirsiniz.'
    },
    {
      question: 'İlaç bilgileri ne kadar günceldir?',
      answer: 'DrugLLM veritabanındaki ilaç bilgileri düzenli olarak güncellenmektedir. Tüm ilaç bilgileri, prospektüsler ve kullanım önerileri en güncel tıbbi kaynaklardan alınmaktadır.'
    },
    {
      question: 'DrugLLM\'i kullanmak ücretli midir?',
      answer: 'DrugLLM hizmetlerinin temel özellikleri ücretsizdir. Sadece bir hesap oluşturmanız yeterlidir. Gelecekte ek özellikler içeren premium abonelik seçenekleri sunulabilir.'
    },
    {
      question: 'Bilgilerimin güvenliği nasıl sağlanıyor?',
      answer: 'DrugLLM, kullanıcı verilerinin güvenliğini en üst düzeyde tutar. Tüm veriler şifrelenir ve gizlilik politikamıza uygun olarak korunur. Kişisel sağlık verileriniz üçüncü taraflarla paylaşılmaz.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Ahmet Yılmaz',
      role: 'Aile Hekimi',
      image: '/images/avatars/doctor-1.jpg',
      content: 'DrugLLM, hasta danışmanlığı sırasında ilaç etkileşimlerini hızlıca kontrol etmeme yardımcı oluyor. Harika bir kaynak!'
    },
    {
      name: 'Ayşe Kaya',
      role: 'Eczacı',
      image: '/images/avatars/pharmacist.jpg',
      content: 'Günlük iş akışımda müşterilerime doğru ilaç bilgisi sunmak için DrugLLM\'i kullanıyorum. Kullanımı çok kolay ve bilgiler güncel.'
    },
    {
      name: 'Mehmet Öztürk',
      role: 'Hasta',
      image: '/images/avatars/patient.jpg',
      content: 'Kronik hastalığım için kullandığım ilaçları daha iyi anlamama yardımcı oldu. Artık yan etkileri ve kullanım şeklini daha iyi biliyorum.'
    }
  ];

  return (
    <Box style={{ 
      background: `linear-gradient(180deg, ${theme.colors.neutral[1]} 0%, white 100%)`,
      minHeight: '100vh'
    }}>
      <Container size="lg" py={40} style={{ margin: '0 auto', maxWidth: '1200px' }}>
        {/* Hero Section */}
        <Box 
          mb={80} 
          style={{ 
            position: 'relative',
            background: `linear-gradient(135deg, ${theme.colors.primary[8]}, ${theme.colors.primary[4]})`,
            borderRadius: '16px',
            padding: '70px 50px',
            overflow: 'hidden',
            color: 'white',
            boxShadow: '0 20px 40px rgba(10, 36, 99, 0.2)'
          }}
        >
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '5%',
            left: '10%',
            width: '200px',
            height: '200px',
            background: 'rgba(62, 146, 204, 0.2)',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }} />

          <Group position="apart" align="flex-start" style={{ position: 'relative', zIndex: 2 }}>
            <Box style={{ maxWidth: '590px' }}>
              <Badge color="secondary" variant="filled" size="lg" radius="sm" mb="md">YENİ</Badge>
              <Title order={1} mb="md" style={{ 
                fontSize: '4rem', 
                fontWeight: 900,
                background: 'linear-gradient(to right, #ffffff, #d0e8ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                DrugLLM
              </Title>
              <Text size="lg" mb="xl" style={{ fontWeight: 300, letterSpacing: '0.3px' }}>
                Yapay zeka destekli ilaç bilgi asistanınız ile ilaçlarınız hakkında güvenilir bilgilere anında erişin.
        </Text>
              <Group spacing="md">
          <Button
            component={Link}
            href="/login"
                  size="lg" 
            radius="md"
                  color="secondary"
                  style={{ 
                    boxShadow: '0 4px 15px rgba(255, 140, 97, 0.3)'
                  }}
          >
            Giriş Yap
          </Button>
          <Button
            component={Link}
                  href="/login?tab=signup"
                  size="lg"
            radius="md"
                  variant="white"
                  color="dark"
          >
            Hesap Oluştur
          </Button>
        </Group>
              <Text size="sm" mt="lg" style={{ opacity: 0.7 }}>
                *Tamamen ücretsiz, kayıt gerektiren bir hizmettir.
              </Text>
            </Box>
            
            <Box style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'relative' 
            }}>
              <div style={{ 
                width: '280px', 
                height: '280px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}>
                <IconPill size={150} style={{ 
                  color: 'white',
                  filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))' 
                }} />
                
                {/* Orbiting elements */}
                <div style={{
                  position: 'absolute',
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.3)',
                  animation: 'rotate 20s linear infinite'
                }}>
                </div>
              </div>
            </Box>
          </Group>
        </Box>

        {/* DrugLLM Intro */}
        <Box mb={80} px="lg">
          <Text align="center" size="xl" color="dimmed" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
            <span style={{ fontWeight: 'bold', color: theme.colors.primary[8] }}>DrugLLM</span>, ilaç bilgilerini anlamlandırmak ve güvenli kullanım sağlamak için
            geliştirilmiş yapay zeka tabanlı bir platformdur. Sağlık profesyonelleri ve hastalar için tasarlanmıştır.
          </Text>
          
          <Divider my={40} variant="dashed" style={{ maxWidth: '200px', margin: '40px auto' }} />
        </Box>

        {/* Özellikler Bölümü */}
        <Title order={2} align="center" mb="sm" style={{ color: theme.colors.primary[8] }}>
          Platformumuzun Sunduğu Hizmetler
        </Title>
        
        <Text align="center" color="dimmed" mb="xl" style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
          DrugLLM ile ilaçlarınız hakkında tüm bilgilere kolayca erişebilirsiniz
        </Text>
        
        <SimpleGrid cols={4} spacing="lg" breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 }
        ]}>
          {features.map((feature, index) => (
            <Card key={index} p="xl" radius="lg" withBorder style={{
              transition: 'transform 0.2s, box-shadow 0.2s',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(10, 36, 99, 0.1)'
              },
              background: index % 2 === 0 ? theme.colors.secondary[0] : theme.colors.primary[0]
            }}>
              <ThemeIcon size={60} radius="md" mb="md" style={{ 
                background: `linear-gradient(45deg, ${theme.colors.primary[8]}, ${theme.colors.primary[5]})`,
                boxShadow: '0 10px 20px rgba(10, 36, 99, 0.15)'
              }}>
                {feature.icon}
              </ThemeIcon>
              <Text weight={700} size="lg" mb="xs" style={{ color: theme.colors.primary[8] }}>{feature.title}</Text>
              <Text size="sm" color="dimmed">{feature.description}</Text>
            </Card>
          ))}
        </SimpleGrid>

        {/* Promo Section */}
        <Box 
          mt={100}
          p={0}
          style={{ 
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            height: '300px'
          }}
        >
          
          <Box
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${theme.colors.primary[9]}cc, ${theme.colors.primary[7]}aa)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px'
            }}
          >
            <Center style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
              <Box>
                <Title order={2} c="white" mb="lg">
                  Sağlığınızı DrugLLM ile Yönetin
                </Title>
                <Text color="white" size="lg" mb="xl" style={{ opacity: 0.9 }}>
                  İlaçlar, yan etkiler ve kullanım talimatları hakkında güvenilir bilgilere anında erişim
                </Text>
                <Button 
                  component={Link}
                  href="/login"
                  size="lg"
                  radius="md"
                  color="secondary.5"
                  rightSection={<IconChevronRight size={18} />}
                >
                  Hemen Başlayın
                </Button>
              </Box>
            </Center>
          </Box>
        </Box>

        {/* Info Section */}
        <Grid mt={100} mb={80} gutter={30}>
          <Grid.Col span={6}>
            <Box style={{
              background: theme.colors.secondary[0],
              borderRadius: '16px',
              padding: '40px',
              height: '100%',
              border: `1px solid ${theme.colors.secondary[2]}`
            }}>
              <Title order={3} mb="lg" style={{ color: theme.colors.primary[8] }}>DrugLLM Teknolojisi</Title>
              <Text mb="xl">
                DrugLLM, büyük dil modelleri ve yapay zeka teknolojilerini kullanarak ilaçlar hakkında kapsamlı ve doğru bilgi sunar.
              </Text>
              
              <SimpleGrid cols={2} spacing="lg">
                {technologies.map((tech, index) => (
                  <Box key={index}>
                    <Group spacing="xs" mb="xs">
                      <ThemeIcon radius="xl" size="md" style={{ background: theme.colors.secondary[7] }}>
                        {tech.icon}
                      </ThemeIcon>
                      <Text weight={700}>{tech.title}</Text>
                    </Group>
                    <Text size="sm" color="dimmed">{tech.description}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Box style={{
              background: `linear-gradient(135deg, ${theme.colors.primary[8]}, ${theme.colors.primary[5]})`,
              borderRadius: '16px',
              padding: '40px',
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Box style={{ position: 'relative' }}>
                <Title order={3} mb="md">Neden DrugLLM?</Title>
                
                <Box mb="md" style={{ display: 'flex', alignItems: 'center' }}>
                  <Box mr="md" style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'rgba(255, 255, 255, 0.2)' 
                  }}>1</Box>
                  <Text size="lg">Güncel tıbbi kaynaklar ve ilaç prospektüslerine erişim</Text>
                </Box>
                
                <Box mb="md" style={{ display: 'flex', alignItems: 'center' }}>
                  <Box mr="md" style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'rgba(255, 255, 255, 0.2)' 
                  }}>2</Box>
                  <Text size="lg">İlaç etkileşimlerini anında kontrol etme imkanı</Text>
                </Box>
                
                <Box mb="md" style={{ display: 'flex', alignItems: 'center' }}>
                  <Box mr="md" style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'rgba(255, 255, 255, 0.2)' 
                  }}>3</Box>
                  <Text size="lg">Kullanım dozajları ve zamanlamaları hakkında bilgilendirme</Text>
                </Box>
                
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Box mr="md" style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'rgba(255, 255, 255, 0.2)' 
                  }}>4</Box>
                  <Text size="lg">7/24 erişilebilirlik ve kullanıcı dostu arayüz</Text>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>

        {/* Alt Call-to-Action */}
        <Card mt={80} p={50} radius="lg" style={{ 
          background: `linear-gradient(to right, ${theme.colors.primary[0]}, ${theme.colors.primary[1]})`,
          border: 'none',
          boxShadow: '0 20px 40px rgba(255, 140, 97, 0.1)'
        }}>
          <Group position="apart" align="center">
            <Box>
              <Title order={3} mb="xs" style={{ color: theme.colors.primary[8] }}>DrugLLM{"'"}e Hemen Başlayın</Title>
              <Text size="lg" style={{ maxWidth: '500px' }}>
                Ücretsiz hesap oluşturarak ilaçlar hakkında detaylı bilgilere anında erişebilirsiniz. Sağlığınız için doğru bilgiye ulaşmanın en kolay yolu.
              </Text>
            </Box>
            <Button
              component={Link}
              href="/login?tab=signup"
              size="xl"
              radius="md"
              color="primary.5"
              style={{ 
                padding: '0 40px',
                boxShadow: '0 10px 20px rgba(255, 140, 97, 0.2)'
              }}
            >
              Hemen Kaydol
            </Button>
          </Group>
        </Card>


        {/* FAQ Section */}
        <Box mt={100} mb={80}>
          <Title order={2} align="center" mb="sm" style={{ color: theme.colors.primary[8] }}>
            Sık Sorulan Sorular
          </Title>
          
          <Text align="center" color="dimmed" mb={40} style={{ maxWidth: '700px', margin: '0 auto' }}>
            DrugLLM hakkında merak edilen sorular ve yanıtları
          </Text>
          
          <Accordion 
            radius="md" 
            styles={{
              item: {
                borderRadius: '8px',
                marginBottom: '10px',
                border: `1px solid ${theme.colors.neutral[3]}`,
                background: 'white'
              },
              control: {
                padding: '16px',
                borderRadius: '8px',
                '&:hover': {
                  background: theme.colors.neutral[0]
                }
              },
              panel: {
                padding: '0 16px 16px'
              },
              chevron: {
                color: theme.colors.primary[5]
              }
            }}
          >
            {faqs.map((faq, index) => (
              <Accordion.Item key={index} value={`faq-${index}`}>
                <Accordion.Control>
                  <Group>
                    <ThemeIcon size="sm" radius="xl" color="primary.4">
                      <IconQuestionMark size={14} />
                    </ThemeIcon>
                    <Text weight={600}>{faq.question}</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text color="dimmed">{faq.answer}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Box>

        {/* Genişletilmiş Footer */}
        <footer style={{ 
          marginTop: 100, 
          borderTop: `1px solid ${theme.colors.neutral[2]}`,
          paddingTop: 60,
          paddingBottom: 40
        }}>
          <Grid gutter={50}>
            <Grid.Col span={4}>
              <Title order={3} mb="md">DrugLLM</Title>
              <Text color="dimmed" size="sm" mb="xl" style={{ maxWidth: '300px' }}>
                İlaç bilgilerine anında erişim sağlayan yapay zeka destekli platformunuz. Sağlığınız için doğru bilgi, her zaman elinizin altında.
              </Text>
              
              <Group spacing="xs" mb="md">
                <ThemeIcon color="primary.5" variant="light" size="lg" radius="xl">
                  <IconBrandTwitter size={18} />
                </ThemeIcon>
                <ThemeIcon color="primary.5" variant="light" size="lg" radius="xl">
                  <IconBrandFacebook size={18} />
                </ThemeIcon>
                <ThemeIcon color="primary.5" variant="light" size="lg" radius="xl">
                  <IconBrandInstagram size={18} />
                </ThemeIcon>
                <ThemeIcon color="primary.5" variant="light" size="lg" radius="xl">
                  <IconBrandYoutube size={18} />
                </ThemeIcon>
              </Group>
            </Grid.Col>
            
            <Grid.Col span={8}>
              <Grid>
                <Grid.Col span={4}>
                  <Text weight={600} mb="md">Hızlı Bağlantılar</Text>
                  <Stack spacing="xs">
                    <Text component={Link} href="/" color="dimmed" size="sm">Ana Sayfa</Text>
                    <Text component={Link} href="/about" color="dimmed" size="sm">Hakkımızda</Text>
                    <Text component={Link} href="/login" color="dimmed" size="sm">Giriş Yap</Text>
                    <Text component={Link} href="/login?tab=signup" color="dimmed" size="sm">Kaydol</Text>
                  </Stack>
                </Grid.Col>
                
                <Grid.Col span={4}>
                  <Text weight={600} mb="md">İletişim</Text>
                  <Stack spacing="xs">
                    <Text color="dimmed" size="sm">info@drugllm.com</Text>
                    <Text color="dimmed" size="sm">+90 (212) 123 4567</Text>
                    <Text color="dimmed" size="sm">İstanbul, Türkiye</Text>
                  </Stack>
                </Grid.Col>
                
                <Grid.Col span={4}>
                  <Text weight={600} mb="md">Yasal</Text>
                  <Stack spacing="xs">
                    <Text component={Link} href="/terms" color="dimmed" size="sm">Kullanım Şartları</Text>
                    <Text component={Link} href="/privacy" color="dimmed" size="sm">Gizlilik Politikası</Text>
                    <Text component={Link} href="/cookies" color="dimmed" size="sm">Çerez Politikası</Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
          
          <Divider my={30} />
          
          <Group position="apart">
            <Text size="sm" color="dimmed">
              © 2025 DrugLLM | Tüm hakları saklıdır.
            </Text>
            <Text size="sm" color="dimmed">
              <span style={{ marginRight: 10 }}>Tasarım ve Geliştirme:</span>
              <b>DrugLLM Ekibi</b>
            </Text>
          </Group>
        </footer>
      </Container>
    </Box>
  );
}
