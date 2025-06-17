"use client";

import { Button, Container, Title, Text, Group, Card, SimpleGrid, Box, ThemeIcon, Divider, Badge, Grid, BackgroundImage, Center, useMantineTheme, Accordion, Avatar, Footer, Stack, ActionIcon } from '@mantine/core';
import { IconPill, IconStethoscope, IconHeartbeat, IconSearch, IconRobot, IconShield, IconCloudComputing, IconDeviceMobile, IconChevronRight, IconBrandTwitter, IconBrandFacebook, IconBrandInstagram, IconBrandYoutube, IconQuestionMark, IconStar, IconUser, IconMessage, IconArrowUp, IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import Navbar from "../components/Navbar";

export default function Home() {
  const theme = useMantineTheme();
  // Medya sorguları ile ekran boyutlarını kontrol et
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  
  // Scroll durumunu izleme
  const [scrollY, setScrollY] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Scroll butonu referansı
  const scrollButtonRef = useRef(null);
  
  // Scroll olayını izle
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Belirli bir mesafe kaydırıldığında yukarı çıkma butonunu göster
      if (currentScrollY > 300) {
        setShowScrollToTop(true);
        // Butonun görünürlüğünü doğrudan DOM'da güncelle
        if (scrollButtonRef.current) {
          scrollButtonRef.current.style.display = 'flex';
        }
      } else {
        setShowScrollToTop(false);
        // Butonun görünürlüğünü doğrudan DOM'da güncelle
        if (scrollButtonRef.current) {
          scrollButtonRef.current.style.display = 'none';
        }
      }
    };
    
    // Sayfa yüklendiğinde scroll durumunu kontrol et
    handleScroll();
    
    // Scroll event'ini ekle
    window.addEventListener('scroll', handleScroll);
    
    // Component unmount olduğunda event listener'ı temizle
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Butonun görünürlüğünü güncelle
  useEffect(() => {
    if (scrollButtonRef.current) {
      scrollButtonRef.current.style.display = showScrollToTop ? 'flex' : 'none';
    }
  }, [showScrollToTop]);
  
  // Sayfanın en üstüne scroll fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const features = [
    {
      icon: <IconPill size={28} />,
      title: 'İlaç Bilgisi',
      description: 'Kullandığınız ilaçlar hakkında detaylı bilgiler edinebilirsiniz.'
    },
    {
      icon: <IconStethoscope size={28} />,
      title: 'Yan Etki Analizi',
      description: 'İlaçların potansiyel yan etkileri hakkında bilgi alabilirsiniz.'
    },
    {
      icon: <IconHeartbeat size={28} />,
      title: 'Etkileşim Kontrolü',
      description: 'Farklı ilaçlar arasındaki etkileşimleri kontrol edebilirsiniz.'
    },
    {
      icon: <IconSearch size={28} />,
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

  return (
    <Box style={{ 
      background: "transparent",
      minHeight: '100vh',
      position: 'relative'
    }}>
      <Navbar />
      
      <Container size="lg" py={isMobile ? 20 : 40} style={{ margin: '0 auto', maxWidth: '1200px' }}>
        {/* Hero Section - Modern ve Enerji Dolu */}
        <Box 
          mb={isMobile ? 40 : 80} 
          className="home-hero"
          style={{ 
            padding: isMobile ? (isSmallMobile ? '40px 20px' : '60px 30px') : '80px 50px',
            zIndex: 2,
          }}
        >
          <Group position={isMobile ? "center" : "apart"} align="flex-start" style={{ position: 'relative', zIndex: 2 }}>
            <Box style={{ maxWidth: isMobile ? '100%' : '590px', textAlign: isMobile ? 'center' : 'left' }}>
              <Badge 
                color="secondary" 
                variant="filled" 
                size={isMobile ? "md" : "lg"} 
                radius="sm" 
                mb="md"
                style={{
                  background: 'var(--secondary)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0, 200, 83, 0.25)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0, 200, 83, 0.3)',
                  }
                }}
              >
                YENİ
              </Badge>
              <Title order={1} mb="md" style={{ 
                fontSize: isSmallMobile ? '2.5rem' : (isMobile ? '3.25rem' : '4.5rem'), 
                fontWeight: 900,
                background: 'linear-gradient(to right, #ffffff, #d0e8ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '24px',
                textShadow: '0 10px 30px rgba(0,0,0,0.15)',
                fontFamily: "'Montserrat', var(--font-geist-sans)",
              }}>
                DrugLLM
              </Title>
              <Text size={isMobile ? "md" : "xl"} mb={isMobile ? "lg" : "xl"} style={{ 
                fontWeight: 400, 
                letterSpacing: '0.3px',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '32px',
                fontSize: isMobile ? '1rem' : '1.25rem',
                fontFamily: "'Open Sans', var(--font-geist-sans)",
              }}>
                Yapay zeka destekli ilaç bilgi asistanınız ile ilaçlarınız hakkında güvenilir bilgilere anında erişin.
              </Text>
              <Group spacing="md" position={isMobile ? "center" : "left"}>
                <Button
                  component={Link}
                  href="/login"
                  size={isMobile ? "md" : "lg"} 
                  radius="md"
                  className="cta-button"
                  style={{ 
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    padding: isMobile ? '0 20px' : '0 24px',
                    height: isMobile ? '42px' : '48px',
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    boxShadow: '0 8px 15px rgba(0, 200, 83, 0.25)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'var(--secondary)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(0, 200, 83, 0.35)',
                    },
                    fontSize: isMobile ? '0.9rem' : '1rem',
                  }}
                >
                  Giriş Yap
                </Button>
                <Button
                  component={Link}
                  href="/login?tab=signup"
                  size={isMobile ? "md" : "lg"}
                  radius="md"
                  className="cta-button"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: isMobile ? '0 20px' : '0 24px',
                    height: isMobile ? '42px' : '48px',
                    fontWeight: 500,
                    letterSpacing: '0.3px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                    },
                    fontSize: isMobile ? '0.9rem' : '1rem',
                  }}
                >
                  Hesap Oluştur
                </Button>
              </Group>
              <Text size={isMobile ? "xs" : "sm"} mt="lg" style={{ 
                opacity: 0.8, 
                fontWeight: 400,
                fontStyle: 'italic',
                letterSpacing: '0.2px'
              }}>
                *Tamamen ücretsiz, kayıt gerektiren bir hizmettir.
              </Text>
            </Box>
            
            {/* Sağdaki Animasyonlu İlaç İkonu */}
            {!isMobile && (
              <Box style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{ 
                  width: '320px', 
                  height: '320px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 0 60px rgba(255, 255, 255, 0.2)',
                  animation: 'pulse 5s infinite ease-in-out',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                    transform: 'rotate(45deg)',
                  }} />
                  <IconPill size={180} stroke={1.5} style={{ 
                    color: 'white', 
                    opacity: 0.95,
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))',
                    animation: 'float 4s infinite ease-in-out',
                  }} />
                </div>
              </Box>
            )}
          </Group>
        </Box>

        {/* Features Section - Responsive & Modern */}
        <Box className="home-section light features-section" style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
          <Container>
            <Box mb={isMobile ? 30 : 60} style={{ textAlign: 'center' }}>
              <Title order={2} mb="md" className="gradient-text" style={{ 
                fontSize: isMobile ? '1.75rem' : '2.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontFamily: "'Montserrat', var(--font-geist-sans)",
              }}>
                Neler Yapabilirsin?
              </Title>
              <Text size={isMobile ? "sm" : "md"} style={{ 
                maxWidth: '700px', 
                margin: '0 auto',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                letterSpacing: '0.2px',
                fontFamily: "'Open Sans', var(--font-geist-sans)",
              }}>
                DrugLLM, ilaçlar hakkında bilgi sahibi olmanızı sağlayan gelişmiş özelliklere sahiptir
              </Text>
            </Box>
            
            <SimpleGrid cols={isMobile ? 1 : (isSmallMobile ? 1 : 4)} spacing={isMobile ? "xl" : 30}>
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  p="xl" 
                  radius="md" 
                  shadow="sm" 
                  className="card-hover"
                  style={{ 
                    background: 'white',
                    height: '100%',
                    border: '1px solid var(--border-color-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  <Box 
                    className="feature-icon"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', 
                      marginBottom: '16px',
                      background: 'linear-gradient(135deg, var(--primary-light) 0%, #BBDEFB 100%)',
                      color: 'var(--primary)',
                      boxShadow: '0 8px 16px rgba(25, 118, 210, 0.15)'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Title order={4} mb="sm" style={{ 
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-title)',
                    fontFamily: "'Montserrat', var(--font-geist-sans)",
                    letterSpacing: '0.2px',
                  }}>
                    {feature.title}
                  </Title>
                  
                  <Text size="sm" style={{ 
                    color: 'var(--text-body)',
                    lineHeight: 1.6,
                    fontFamily: "'Open Sans', var(--font-geist-sans)",
                    letterSpacing: '0.1px',
                  }}>
                    {feature.description}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* Technology Section - Modern */}
        <Box 
          className="home-section primary-light"
          style={{ 
            padding: isMobile ? '40px 0' : '80px 0',
            marginTop: isMobile ? '20px' : '40px',
          }}
        >
          <Container>
            <Box mb={isMobile ? 30 : 60} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Title order={2} mb="md" className="gradient-text" style={{ 
                fontSize: isMobile ? '1.75rem' : '2.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontFamily: "'Montserrat', var(--font-geist-sans)",
              }}>
                Teknolojinin Gücü
              </Title>
              <Text size={isMobile ? "sm" : "md"} style={{ 
                maxWidth: '700px', 
                margin: '0 auto',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                letterSpacing: '0.2px',
                fontFamily: "'Open Sans', var(--font-geist-sans)",
              }}>
                Gelişmiş yapay zeka algoritmalarımız sayesinde sağlık bilgilerine erişim artık çok daha kolay
              </Text>
            </Box>
            
            <SimpleGrid cols={isMobile ? 1 : 4} spacing={isMobile ? "xl" : 30}>
              {technologies.map((tech, index) => (
                <Card 
                  key={index} 
                  p="xl" 
                  radius="lg" 
                  shadow="sm"
                  className="card-hover"
                  style={{ 
                    background: 'white',
                    height: '100%',
                    border: '1px solid var(--border-color-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    textAlign: isMobile ? 'center' : 'left',
                    position: 'relative',
                    zIndex: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', 
                      marginBottom: '16px',
                      background: 'linear-gradient(135deg, var(--primary-light) 0%, #BBDEFB 100%)',
                      color: 'var(--primary)',
                      boxShadow: '0 8px 16px rgba(25, 118, 210, 0.15)'
                    }}
                  >
                    {tech.icon}
                  </Box>
                  
                  <Title order={4} mb="sm" style={{ 
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-title)',
                    fontFamily: "'Montserrat', var(--font-geist-sans)",
                    letterSpacing: '0.2px',
                  }}>
                    {tech.title}
                  </Title>
                  
                  <Text size="sm" style={{ 
                    color: 'var(--text-body)',
                    lineHeight: 1.6,
                    fontFamily: "'Open Sans', var(--font-geist-sans)",
                    letterSpacing: '0.1px',
                  }}>
                    {tech.description}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* FAQ Section - Modern */}
        <Box className="home-section light" style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
          <Container>
            <Box mb={isMobile ? 30 : 60} style={{ textAlign: 'center' }}>
              <Title order={2} mb="md" className="gradient-text" style={{ 
                fontSize: isMobile ? '1.75rem' : '2.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontFamily: "'Montserrat', var(--font-geist-sans)",
              }}>
                Sık Sorulan Sorular
              </Title>
              <Text size={isMobile ? "sm" : "md"} style={{ 
                maxWidth: '700px', 
                margin: '0 auto',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                letterSpacing: '0.2px',
                fontFamily: "'Open Sans', var(--font-geist-sans)",
              }}>
                DrugLLM ile ilgili merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
              </Text>
            </Box>
            
            <Box style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid var(--border-color-light)'
            }}>
              <Accordion variant="separated">
                {faqs.map((faq, index) => (
                  <Accordion.Item 
                    key={index} 
                    value={`item-${index}`}
                    style={{ 
                      border: 'none',
                      backgroundColor: 'white',
                      borderBottom: index < faqs.length - 1 ? '1px solid var(--border-color-light)' : 'none'
                    }}
                  >
                    <Accordion.Control
                      style={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: 'var(--text-title)',
                        padding: '20px 24px',
                        fontFamily: "'Montserrat', var(--font-geist-sans)",
                      }}
                    >
                      {faq.question}
                    </Accordion.Control>
                    <Accordion.Panel 
                      style={{
                        color: 'var(--text-body)',
                        padding: '0 24px 20px',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        fontFamily: "'Open Sans', var(--font-geist-sans)",
                        letterSpacing: '0.1px',
                      }}
                    >
                      {faq.answer}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Box>
          </Container>
        </Box>

        {/* Testimonials Section - Modern */}
        <Box 
          className="home-section primary-light"
          style={{ 
            padding: isMobile ? '40px 0' : '80px 0',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Container>
            <Box mb={isMobile ? 30 : 60} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Title order={2} mb="md" className="gradient-text" style={{ 
                fontSize: isMobile ? '1.75rem' : '2.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontFamily: "'Montserrat', var(--font-geist-sans)",
              }}>
                Kullanıcı Yorumları
              </Title>
              <Text size={isMobile ? "sm" : "md"} style={{ 
                maxWidth: '700px', 
                margin: '0 auto',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                letterSpacing: '0.2px',
                fontFamily: "'Open Sans', var(--font-geist-sans)",
              }}>
                DrugLLM&apos;i kullanan profesyoneller ve hastalar ne diyor?
              </Text>
            </Box>
            
            <SimpleGrid cols={isMobile ? 1 : 3} spacing={isMobile ? "xl" : 30}>
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  p={0}
                  radius="lg"
                  className="testimonial-card"
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <Box p="lg">
                    <Group position="apart" mb="md" align="flex-start">
                      <Group>
                        <Avatar
                          src={testimonial.image}
                          size="lg"
                          radius="xl"
                          style={{ border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                        />
                        <Box>
                          <Text fw={700} size="sm" style={{ 
                            color: 'var(--text-title)',
                            fontFamily: "'Montserrat', var(--font-geist-sans)",
                          }}>
                            {testimonial.name}
                          </Text>
                          <Text size="xs" style={{ color: 'var(--primary)' }}>
                            {testimonial.role}
                          </Text>
                        </Box>
                      </Group>
                      <ThemeIcon 
                        size={36} 
                        radius="xl" 
                        style={{ 
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)'
                        }}
                      >
                        <IconStar size={20} fill="var(--primary)" stroke={0} />
                      </ThemeIcon>
                    </Group>
                    
                    <Text 
                      size="sm" 
                      style={{ 
                        lineHeight: 1.6,
                        color: 'var(--text-body)',
                        fontStyle: 'italic',
                        position: 'relative',
                        paddingLeft: '8px',
                        fontFamily: "'Open Sans', var(--font-geist-sans)",
                        letterSpacing: '0.1px',
                      }}
                      component="div"
                    >
                      <div style={{ 
                        position: 'absolute',
                        left: '-6px',
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        borderRadius: '4px',
                        background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-light) 100%)'
                      }} />
                      &ldquo;{testimonial.content}&rdquo;
                    </Text>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* CTA Section - Modern & Energetic */}
        <Box 
          className="home-section light"
          style={{ 
            padding: isMobile ? '40px 0' : '80px 0',
            position: 'relative',
            marginBottom: isMobile ? '20px' : '40px'
          }}
        >
          <Container>
            <Card 
              p={isMobile ? "xl" : 50} 
              radius="lg" 
              shadow="md"
              style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, #1565C0 100%)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1
              }} />
              
              <Box style={{ position: 'relative', zIndex: 2 }}>
                <Group position={isMobile ? "center" : "apart"} align="center">
                  <Box style={{ maxWidth: '600px', textAlign: isMobile ? 'center' : 'left' }}>
                    <Title order={3} mb="md" style={{ 
                      color: 'white',
                      fontSize: isMobile ? '1.5rem' : '2rem',
                      fontWeight: 700,
                      fontFamily: "'Montserrat', var(--font-geist-sans)",
                      letterSpacing: '0.3px',
                    }}>
                      Hemen Başlayın!
                    </Title>
                    <Text color="white" opacity={0.9} mb="xl" size={isMobile ? "sm" : "md"} style={{
                      lineHeight: 1.7,
                      letterSpacing: '0.2px',
                      fontFamily: "'Open Sans', var(--font-geist-sans)",
                    }}>
                      Ücretsiz hesabınızı oluşturun ve ilaçlar hakkında detaylı bilgilere hemen ulaşın. Sağlığınız için doğru bilgi her zaman önemlidir.
                    </Text>
                    
                    <Button
                      component={Link}
                      href="/login?tab=signup"
                      size="lg"
                      radius="md"
                      className="cta-button"
                      style={{ 
                        backgroundColor: 'var(--secondary)',
                        color: 'white',
                        padding: '0 32px',
                        height: '50px',
                        fontWeight: 600,
                        boxShadow: '0 10px 20px rgba(0, 200, 83, 0.25)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'var(--secondary)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 25px rgba(0, 200, 83, 0.35)',
                        }
                      }}
                    >
                      Ücretsiz Hesap Oluştur
                    </Button>
                  </Box>
                  
                  {!isMobile && (
                    <ThemeIcon 
                      size={200} 
                      radius="xl"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                        color: 'white'
                      }}
                    >
                      <IconMessage size={100} stroke={1} />
                    </ThemeIcon>
                  )}
                </Group>
              </Box>
            </Card>
          </Container>
        </Box>

        {/* Footer - Simple & Modern */}
        <Box 
          style={{ 
            borderTop: '1px solid var(--border-color-light)',
            padding: isMobile ? '30px 0' : '40px 0',
            backgroundColor: 'white'
          }}
        >
          <Container>
            <Group position="apart" align="center">
              <Text size="sm" color="dimmed">
                © 2025 DrugLLM. Tüm hakları saklıdır.
              </Text>
              
              <Group spacing="md">
                <ActionIcon 
                  size="lg" 
                  radius="xl"
                  variant="light" 
                  color="primary"
                >
                  <IconBrandTwitter size={18} />
                </ActionIcon>
                <ActionIcon 
                  size="lg" 
                  radius="xl"
                  variant="light" 
                  color="primary"
                >
                  <IconBrandFacebook size={18} />
                </ActionIcon>
                <ActionIcon 
                  size="lg" 
                  radius="xl"
                  variant="light" 
                  color="primary"
                >
                  <IconBrandInstagram size={18} />
                </ActionIcon>
              </Group>
            </Group>
          </Container>
        </Box>
      </Container>
      
      {/* Yukarı Çıkma Butonu - Basitleştirilmiş */}
      <Button
        onClick={scrollToTop}
        id="scrollTopButton"
        ref={scrollButtonRef}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#1976D2',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(25, 118, 210, 0.5)',
          cursor: 'pointer',
          display: 'none', // Başlangıçta gizli, JavaScript ile kontrol edilecek
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          fontSize: '24px',
          fontWeight: 'bold'
        }}
        aria-label="Yukarı çık"
      >
        ↑
      </Button>
    </Box>
  );
}
