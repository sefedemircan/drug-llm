"use client";

import { Button, Container, Title, Text, Group, Card, SimpleGrid, Box, ThemeIcon, Divider, Badge, Grid, BackgroundImage, Center, useMantineTheme, Accordion, Avatar, Footer, Stack } from '@mantine/core';
import { IconPill, IconStethoscope, IconHeartbeat, IconSearch, IconRobot, IconShield, IconCloudComputing, IconDeviceMobile, IconChevronRight, IconBrandTwitter, IconBrandFacebook, IconBrandInstagram, IconBrandYoutube, IconQuestionMark, IconStar, IconUser, IconMessage, IconArrowUp } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import Navbar from "../components/Navbar";
import ScrollToTop from "../components/ScrollToTop";

export default function Home() {
  const theme = useMantineTheme();
  // Medya sorguları ile ekran boyutlarını kontrol et
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  
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
      name: 'Mahmut Tuncer',
      role: 'Aile Hekimi', 
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      content: 'DrugLLM, hasta danışmanlığı sırasında ilaç etkileşimlerini hızlıca kontrol etmeme yardımcı oluyor. Harika bir kaynak!'
    },
    {
      name: 'Ayşe Kaya',
      role: 'Eczacı',
      image: 'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: 'Günlük iş akışımda müşterilerime doğru ilaç bilgisi sunmak için DrugLLM\'i kullanıyorum. Kullanımı çok kolay ve bilgiler güncel.'
    },
    {
      name: 'Kamil Öztürk', 
      role: 'Hasta',
      image: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: 'Kronik hastalığım için kullandığım ilaçları daha iyi anlamama yardımcı oldu. Artık yan etkileri ve kullanım şeklini daha iyi biliyorum.'
    }
  ];

  // Sayfa başına dönme fonksiyonu
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box style={{ 
      background: `linear-gradient(180deg, ${theme.colors.neutral[1]} 0%, white 100%)`,
      minHeight: '100vh'
    }}>
      <Navbar />
      <Button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          padding: 0,
          backgroundColor: theme.colors.primary[6],
          '&:hover': {
            backgroundColor: theme.colors.primary[7],
          }
        }}
      >
        <IconArrowUp size={24} />
      </Button>
      <ScrollToTop />
      <Container size="lg" py={isMobile ? 20 : 40} style={{ margin: '0 auto', maxWidth: '1200px' }}>
        {/* Hero Section - Responsive */}
        <Box 
          mb={isMobile ? 40 : 80} 
          style={{ 
            position: 'relative',
            background: `linear-gradient(135deg, ${theme.colors.primary[8]}, ${theme.colors.primary[4]})`,
            borderRadius: isMobile ? '12px' : '16px',
            padding: isMobile ? (isSmallMobile ? '40px 20px' : '50px 30px') : '70px 50px',
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
            width: isMobile ? '150px' : '300px',
            height: isMobile ? '150px' : '300px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            display: isSmallMobile ? 'none' : 'block'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '5%',
            left: '10%',
            width: isMobile ? '100px' : '200px',
            height: isMobile ? '100px' : '200px',
            background: 'rgba(62, 146, 204, 0.2)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            display: isSmallMobile ? 'none' : 'block'
          }} />

          <Group position={isMobile ? "center" : "apart"} align="flex-start" style={{ position: 'relative', zIndex: 2 }}>
            <Box style={{ maxWidth: isMobile ? '100%' : '590px', textAlign: isMobile ? 'center' : 'left' }}>
              <Badge color="secondary" variant="filled" size={isMobile ? "md" : "lg"} radius="sm" mb="md">YENİ</Badge>
              <Title order={1} mb="md" style={{ 
                fontSize: isSmallMobile ? '2.5rem' : (isMobile ? '3rem' : '4rem'), 
                fontWeight: 900,
                background: 'linear-gradient(to right, #ffffff, #d0e8ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                DrugLLM
              </Title>
              <Text size={isMobile ? "md" : "lg"} mb={isMobile ? "lg" : "xl"} style={{ fontWeight: 300, letterSpacing: '0.3px' }}>
                Yapay zeka destekli ilaç bilgi asistanınız ile ilaçlarınız hakkında güvenilir bilgilere anında erişin.
              </Text>
              <Group spacing="md" position={isMobile ? "center" : "left"}>
                <Button
                  component={Link}
                  href="/login"
                  size={isMobile ? "md" : "lg"} 
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
                  size={isMobile ? "md" : "lg"}
                  radius="md"
                  variant="white"
                  color="dark"
                >
                  Hesap Oluştur
                </Button>
              </Group>
              <Text size={isMobile ? "xs" : "sm"} mt="lg" style={{ opacity: 0.7 }}>
                *Tamamen ücretsiz, kayıt gerektiren bir hizmettir.
              </Text>
            </Box>
            
            {/* Sağdaki Hap Görseli - Mobilde Gizlendi */}
            {!isMobile && (
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
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 0 40px rgba(255, 255, 255, 0.1)'
                }}>
                  <IconPill size={160} stroke={1} style={{ color: 'white', opacity: 0.9 }} />
                </div>
              </Box>
            )}
          </Group>
        </Box>

        {/* Özellikler - 2x2 Grid Mobil, 4x1 Desktop */}
        <Box mb={isMobile ? 40 : 80}>
          <Title order={2} align="center" mb={isMobile ? "md" : "xl"} style={{ color: theme.colors.primary[7] }}>
            Nasıl Yardımcı Olabiliriz?
          </Title>
          
          <SimpleGrid cols={isMobile ? 1 : (isSmallMobile ? 1 : 4)} spacing={isMobile ? "md" : "lg"}>
            {features.map((feature, index) => (
              <Card key={index} p="lg" radius="md" shadow="sm" style={{ height: '100%' }}>
                <ThemeIcon size={56} radius="md" color="secondary" mb="md">
                  {feature.icon}
                </ThemeIcon>
                <Text fw={700} size="lg" mb="xs">{feature.title}</Text>
                <Text size="sm" color="dimmed">{feature.description}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Teknolojiler - İnteraktif Kartlar */}
        <Box mb={isMobile ? 40 : 80} px={isMobile ? 0 : "md"}>
          <Title order={2} align="center" mb={isMobile ? "md" : "xl"}>
            Modern Teknoloji
          </Title>
          
          <SimpleGrid cols={isMobile ? 1 : (isSmallMobile ? 1 : 4)} spacing={isMobile ? "md" : "lg"}>
            {technologies.map((tech, index) => (
              <Card 
                key={index} 
                p="xl" 
                radius="md" 
                style={{ 
                  borderLeft: `4px solid ${theme.colors.primary[5]}`,
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                sx={{
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <ThemeIcon size={48} radius="md" color="secondary" variant="light" mb="md">
                  {tech.icon}
                </ThemeIcon>
                <Text fw={700} size="lg" mb="xs">{tech.title}</Text>
                <Text size="sm" color="dimmed">{tech.description}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* SSS - Accordion */}
        <Box mb={isMobile ? 40 : 80}>
          <Title order={2} align="center" mb={isMobile ? "lg" : "xl"}>
            Sıkça Sorulan Sorular
          </Title>
          
          <Accordion variant="separated" radius="md">
            {faqs.map((faq, index) => (
              <Accordion.Item key={index} value={`item-${index}`}>
                <Accordion.Control>
                  <Text fw={600}>{faq.question}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">{faq.answer}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Box>

        {/* Kullanıcı Görüşleri */}
        <Box mb={isMobile ? 40 : 80}>
          <Title order={2} align="center" mb={isMobile ? "md" : "xl"}>
            Kullanıcılarımız Ne Diyor?
          </Title>
          
          <SimpleGrid cols={isMobile ? 1 : 3} spacing={isMobile ? "lg" : "xl"}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} p="lg" radius="md" shadow="sm" style={{ height: '100%' }}>
                <Card.Section p="md">
                  <Group position="apart">
                    <Group>
                      <Avatar src={testimonial.image} size={isMobile ? 50 : 60} radius="xl" />
                      <div>
                        <Text fw={700} size="md">{testimonial.name}</Text>
                        <Text size="xs" color="dimmed">{testimonial.role}</Text>
                      </div>
                    </Group>
                    <ThemeIcon variant="light" color="primary" size="lg" radius="xl">
                      <IconStar size={20} />
                    </ThemeIcon>
                  </Group>
                </Card.Section>
                <Text pt="md" size="sm" style={{ fontStyle: 'italic' }}>&quot;{testimonial.content}&quot;</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* CTA Bölümü */}
        <Box 
          py={isMobile ? "xl" : 50} 
          px={isMobile ? "md" : 60} 
          mb={isMobile ? 30 : 50} 
          style={{
            background: `linear-gradient(135deg, ${theme.colors.secondary[7]}, ${theme.colors.secondary[5]})`,
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Title order={2} mb="lg" style={{ fontSize: isMobile ? '1.8rem' : '2.5rem' }}>Hemen Kullanmaya Başlayın</Title>
          <Text size={isMobile ? "sm" : "md"} mb="xl" style={{ maxWidth: '700px', margin: '0 auto' }}>
            DrugLLM ile ilaçlarınız hakkında güvenilir bilgilere anında erişin. Ücretsiz hesap oluşturarak tüm özelliklere erişebilirsiniz.
          </Text>
          <Group position="center" spacing="md">
            <Button 
              component={Link}
              href="/chat"
              size={isMobile ? "md" : "lg"} 
              radius="md" 
              color="white"
              styles={{
                root: { 
                  color: theme.colors.secondary[7],
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.colors.secondary[1],
                    transform: 'translateY(-2px)'
                  }
                }
              }}
            >
              Şimdi Başla <IconChevronRight size={16} style={{ marginLeft: 5 }} />
            </Button>
            <Button 
              component={Link}
              href="/about"
              size={isMobile ? "md" : "lg"} 
              radius="md" 
              variant="outline" 
              color="white"
            >
              Daha Fazla Bilgi
            </Button>
          </Group>
        </Box>
        
        {/* Footer */}
        <footer style={{ 
          padding: isMobile ? '20px 0' : '40px 0', 
          borderTop: '1px solid #eaeaea',
          marginTop: '20px'
        }}>
          <Grid gutter={isMobile ? "md" : "xl"}>
            <Grid.Col span={isMobile ? 12 : 6}>
              <Group spacing="xs" mb={isMobile ? "md" : 0}>
                <IconPill size={24} color={theme.colors.primary[7]} />
                <Text fw={700} size="lg" color={theme.colors.primary[7]}>DrugLLM</Text>
              </Group>
              <Text size="sm" color="dimmed" style={{ maxWidth: '400px', marginTop: '10px' }}>
                Yapay zeka destekli ilaç bilgi asistanınız ile ilaçlarınız hakkında güvenilir bilgilere anında erişin.
              </Text>
              
              <Group spacing="xs" mt="lg">
                <ThemeIcon variant="light" color="gray" radius="xl" size="md">
                  <IconBrandTwitter size={16} />
                </ThemeIcon>
                <ThemeIcon variant="light" color="gray" radius="xl" size="md">
                  <IconBrandFacebook size={16} />
                </ThemeIcon>
                <ThemeIcon variant="light" color="gray" radius="xl" size="md">
                  <IconBrandInstagram size={16} />
                </ThemeIcon>
                <ThemeIcon variant="light" color="gray" radius="xl" size="md">
                  <IconBrandYoutube size={16} />
                </ThemeIcon>
              </Group>
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 6 : 2}>
              <Text fw={700} mb="md">Hızlı Erişim</Text>
              <Stack spacing="xs">
                <Link href="/" style={{ color: 'inherit' }}>Ana Sayfa</Link>
                <Link href="/about" style={{ color: 'inherit' }}>Hakkımızda</Link>
                <Link href="/chat" style={{ color: 'inherit' }}>İlaç Chatbot</Link>
                <Link href="/faq" style={{ color: 'inherit' }}>S.S.S.</Link>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 6 : 2}>
              <Text fw={700} mb="md">Kaynaklar</Text>
              <Stack spacing="xs">
                <Link href="/docs" style={{ color: 'inherit' }}>Dokümantasyon</Link>
                <Link href="/privacy" style={{ color: 'inherit' }}>Gizlilik Politikası</Link>
                <Link href="/terms" style={{ color: 'inherit' }}>Kullanım Şartları</Link>
                <Link href="/contact" style={{ color: 'inherit' }}>İletişim</Link>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 12 : 2}>
              <Text fw={700} mb="md">İletişim</Text>
              <Stack spacing="xs">
                <Text size="sm">info@drugllm.com</Text>
                <Text size="sm">+90 (212) 123 45 67</Text>
                <Text size="sm">İstanbul, Türkiye</Text>
              </Stack>
            </Grid.Col>
          </Grid>
          
          <Divider my={isMobile ? "md" : "xl"} />
          
          <Group position="apart" style={{ opacity: 0.7 }}>
            <Text size="xs">© 2025 DrugLLM. Tüm hakları saklıdır.</Text>
            <Group spacing="xs">
              <Link href="/privacy" style={{ color: 'inherit', fontSize: '12px' }}>Gizlilik</Link>
              <Text size="xs">•</Text>
              <Link href="/terms" style={{ color: 'inherit', fontSize: '12px' }}>Şartlar</Link>
            </Group>
          </Group>
        </footer>
      </Container>
    </Box>
  );
}
