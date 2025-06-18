"use client";

import {
  Button,
  Container,
  Title,
  Text,
  Group,
  Card,
  SimpleGrid,
  Box,
  ThemeIcon,
  Divider,
  Badge,
  Grid,
  BackgroundImage,
  Center,
  useMantineTheme,
  Accordion,
  Avatar,
  Footer,
  Stack,
  ActionIcon,
} from "@mantine/core";
import {
  IconPill,
  IconStethoscope,
  IconHeartbeat,
  IconSearch,
  IconRobot,
  IconShield,
  IconCloudComputing,
  IconDeviceMobile,
  IconChevronRight,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconQuestionMark,
  IconStar,
  IconUser,
  IconMessage,
  IconArrowUp,
  IconChevronDown,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@mantine/hooks";
import Navbar from "../components/Navbar";

// Optimized custom hook for scroll animations
const useScrollAnimation = () => {
  const observerRef = useRef(null);
  const animatedElementsRef = useRef(new Set());

  useEffect(() => {
    // Create optimized intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !animatedElementsRef.current.has(entry.target)) {
              const element = entry.target;
              element.classList.add('animate-in');
              animatedElementsRef.current.add(element);
              
              // Stop observing animated elements to improve performance
              observer.unobserve(element);
            }
          });
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px' // Reduced for better performance
      }
    );

    observerRef.current = observer;

    // Debounced element observation
    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-animate:not(.animate-in)');
      elements.forEach((el) => {
        if (!animatedElementsRef.current.has(el)) {
          observer.observe(el);
        }
      });
    };

    // Initial observation with slight delay
    const timeoutId = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return null; // No need to return state for performance
};

export default function Home() {
  const theme = useMantineTheme();
  // Medya sorguları ile ekran boyutlarını kontrol et
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallMobile = useMediaQuery("(max-width: 480px)");

  // Scroll animasyonları için custom hook
  useScrollAnimation();

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
          scrollButtonRef.current.style.display = "flex";
        }
      } else {
        setShowScrollToTop(false);
        // Butonun görünürlüğünü doğrudan DOM'da güncelle
        if (scrollButtonRef.current) {
          scrollButtonRef.current.style.display = "none";
        }
      }
    };

    // Sayfa yüklendiğinde scroll durumunu kontrol et
    handleScroll();

    // Scroll event'ini ekle
    window.addEventListener("scroll", handleScroll);

    // Component unmount olduğunda event listener'ı temizle
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Butonun görünürlüğünü güncelle
  useEffect(() => {
    if (scrollButtonRef.current) {
      scrollButtonRef.current.style.display = showScrollToTop ? "flex" : "none";
    }
  }, [showScrollToTop]);

  // CSS animasyonlarını sayfa yüklendiğinde ekle
  useEffect(() => {
    const styles = `
      /* Performance optimization - GPU acceleration */
      .scroll-animate,
      .hero-animate,
      .card-hover,
      .cta-button,
      .testimonial-card {
        will-change: transform, opacity;
        transform-origin: center;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        perspective: 1000px;
      }

      /* Optimized scroll animations */
      .scroll-animate {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .scroll-animate.animate-in {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }

      .scroll-animate.fade-up {
        transform: translate3d(0, 50px, 0);
      }

      .scroll-animate.fade-up.animate-in {
        transform: translate3d(0, 0, 0);
      }

      .scroll-animate.fade-left {
        transform: translate3d(-50px, 0, 0);
      }

      .scroll-animate.fade-left.animate-in {
        transform: translate3d(0, 0, 0);
      }

      .scroll-animate.fade-right {
        transform: translate3d(50px, 0, 0);
      }

      .scroll-animate.fade-right.animate-in {
        transform: translate3d(0, 0, 0);
      }

      .scroll-animate.scale-up {
        transform: scale3d(0.9, 0.9, 1);
      }

      .scroll-animate.scale-up.animate-in {
        transform: scale3d(1, 1, 1);
      }

      /* Staggered delays for performance */
      .scroll-animate.delay-100 {
        transition-delay: 0.05s;
      }

      .scroll-animate.delay-200 {
        transition-delay: 0.1s;
      }

      .scroll-animate.delay-300 {
        transition-delay: 0.15s;
      }

      .scroll-animate.delay-400 {
        transition-delay: 0.2s;
      }

      /* Optimized hero animations */
      .hero-animate {
        opacity: 0;
        transform: translate3d(0, 20px, 0);
        animation: heroFadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      @keyframes heroFadeIn {
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }

      .hero-animate.delay-100 {
        animation-delay: 0.05s;
      }

      .hero-animate.delay-200 {
        animation-delay: 0.1s;
      }

      .hero-animate.delay-300 {
        animation-delay: 0.15s;
      }

      /* Optimized hover effects */
      .card-hover {
        transform: translate3d(0, 0, 0);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .card-hover:hover {
        transform: translate3d(0, -5px, 0);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      }

      .testimonial-card {
        transform: translate3d(0, 0, 0);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .testimonial-card:hover {
        transform: translate3d(0, -3px, 0);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      }

      /* Reduce animations on low-end devices */
      @media (prefers-reduced-motion: reduce) {
        .scroll-animate,
        .hero-animate,
        .card-hover,
        .testimonial-card {
          animation: none;
          transition: none;
        }
      }

      /* GPU layer creation for performance */
      .feature-icon,
      .social-icon {
        transform: translate3d(0, 0, 0);
        transition: transform 0.15s ease;
      }

      .feature-icon:hover,
      .social-icon:hover {
        transform: translate3d(0, -2px, 0);
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  // Sayfanın en üstüne scroll fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const features = [
    {
      icon: <IconPill size={28} />,
      title: "İlaç Bilgisi",
      description:
        "Kullandığınız ilaçlar hakkında detaylı bilgiler edinebilirsiniz.",
    },
    {
      icon: <IconStethoscope size={28} />,
      title: "Yan Etki Analizi",
      description:
        "İlaçların potansiyel yan etkileri hakkında bilgi alabilirsiniz.",
    },
    {
      icon: <IconHeartbeat size={28} />,
      title: "Etkileşim Kontrolü",
      description:
        "Farklı ilaçlar arasındaki etkileşimleri kontrol edebilirsiniz.",
    },
    {
      icon: <IconSearch size={28} />,
      title: "Akıllı Arama",
      description: "İlaç ismi veya etken madde ile arama yapabilirsiniz.",
    },
  ];

  const technologies = [
    {
      icon: <IconRobot size={24} />,
      title: "Yapay Zeka",
      description:
        "En güncel yapay zeka teknolojileri ile ilaç bilgilerine erişim",
    },
    {
      icon: <IconShield size={24} />,
      title: "Güvenilir Bilgi",
      description: "Resmi kaynaklardan doğrulanmış ilaç bilgileri",
    },
    {
      icon: <IconCloudComputing size={24} />,
      title: "Gerçek Zamanlı",
      description: "Anlık güncellenen ilaç veritabanı",
    },
    {
      icon: <IconDeviceMobile size={24} />,
      title: "Mobil Uyumlu",
      description: "Tüm cihazlardan erişilebilen arayüz",
    },
  ];

  const faqs = [
    {
      question: "DrugLLM nasıl çalışır?",
      answer:
        "DrugLLM, büyük dil modelleri ve yapay zeka teknolojisini kullanarak ilaçlar hakkında güncel bilgileri işleyip anlaşılır şekilde sunar. Sistem, güvenilir tıbbi kaynakları kullanarak doğru bilgileri sağlar.",
    },
    {
      question: "DrugLLM'i hangi cihazlarda kullanabilirim?",
      answer:
        "DrugLLM web tabanlı bir uygulama olduğu için bilgisayar, tablet ve akıllı telefonlar dahil olmak üzere internet bağlantısı olan tüm cihazlarınızdan erişebilirsiniz.",
    },
    {
      question: "İlaç bilgileri ne kadar günceldir?",
      answer:
        "DrugLLM veritabanındaki ilaç bilgileri düzenli olarak güncellenmektedir. Tüm ilaç bilgileri, prospektüsler ve kullanım önerileri en güncel tıbbi kaynaklardan alınmaktadır.",
    },
    {
      question: "DrugLLM'i kullanmak ücretli midir?",
      answer:
        "DrugLLM hizmetlerinin temel özellikleri ücretsizdir. Sadece bir hesap oluşturmanız yeterlidir. Gelecekte ek özellikler içeren premium abonelik seçenekleri sunulabilir.",
    },
    {
      question: "Bilgilerimin güvenliği nasıl sağlanıyor?",
      answer:
        "DrugLLM, kullanıcı verilerinin güvenliğini en üst düzeyde tutar. Tüm veriler şifrelenir ve gizlilik politikamıza uygun olarak korunur. Kişisel sağlık verileriniz üçüncü taraflarla paylaşılmaz.",
    },
  ];

  const testimonials = [
    {
      name: "Mahmut Tuncer",
      role: "Aile Hekimi",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      content:
        "DrugLLM, hasta danışmanlığı sırasında ilaç etkileşimlerini hızlıca kontrol etmeme yardımcı oluyor. Harika bir kaynak!",
    },
    {
      name: "Ayşe Kaya",
      role: "Eczacı",
      image:
        "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content:
        "Günlük iş akışımda müşterilerime doğru ilaç bilgisi sunmak için DrugLLM'i kullanıyorum. Kullanımı çok kolay ve bilgiler güncel.",
    },
    {
      name: "Kamil Öztürk",
      role: "Hasta",
      image:
        "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content:
        "Kronik hastalığım için kullandığım ilaçları daha iyi anlamama yardımcı oldu. Artık yan etkileri ve kullanım şeklini daha iyi biliyorum.",
    },
  ];

  return (
    <Box
      style={{
        background: "transparent",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Navbar />

      <Container
        size="lg"
        py={isMobile ? 20 : 40}
        style={{ margin: "0 auto", maxWidth: "1200px" }}
      >
        {/* Hero Section - Modern ve Enerji Dolu */}
        <Box
          mb={isMobile ? 40 : 80}
          className="home-hero"
          style={{
            padding: isMobile
              ? isSmallMobile
                ? "40px 20px"
                : "60px 30px"
              : "80px 50px",
            zIndex: 2,
          }}
        >
          <Group
            position={isMobile ? "center" : "apart"}
            align="flex-start"
            style={{ position: "relative", zIndex: 2 }}
          >
            <Box
              style={{
                maxWidth: isMobile ? "100%" : "590px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <Badge
                color="secondary"
                variant="filled"
                size={isMobile ? "md" : "lg"}
                radius="sm"
                mb="md"
                className="hero-animate"
                style={{
                  background: "var(--secondary)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(0, 200, 83, 0.25)",
                  transform: "translateY(0)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(0, 200, 83, 0.3)",
                  },
                }}
              >
                YENİ
              </Badge>
              <Title
                order={1}
                mb="md"
                className="hero-animate delay-100"
                style={{
                  fontSize: isSmallMobile
                    ? "2.5rem"
                    : isMobile
                    ? "3.25rem"
                    : "4.5rem",
                  fontWeight: 900,
                  background: "linear-gradient(to right, #ffffff, #d0e8ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  marginBottom: "24px",
                  textShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  fontFamily: "'Montserrat', var(--font-geist-sans)",
                }}
              >
                DrugLLM
              </Title>
              <Text
                size={isMobile ? "md" : "xl"}
                mb={isMobile ? "lg" : "xl"}
                className="hero-animate delay-200"
                style={{
                  fontWeight: 400,
                  letterSpacing: "0.3px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "32px",
                  fontSize: isMobile ? "1rem" : "1.25rem",
                  fontFamily: "'Open Sans', var(--font-geist-sans)",
                }}
              >
                Yapay zeka destekli ilaç bilgi asistanınız ile ilaçlarınız
                hakkında güvenilir bilgilere anında erişin.
              </Text>
              <Group 
                spacing="md" 
                position={isMobile ? "center" : "left"}
                className="hero-animate delay-300"
              >
                <Button
                  component={Link}
                  href="/login"
                  size={isMobile ? "md" : "lg"}
                  radius="md"
                  className="cta-button"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "white",
                    padding: isMobile ? "0 20px" : "0 24px",
                    height: isMobile ? "42px" : "48px",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                    boxShadow: "0 8px 15px rgba(0, 200, 83, 0.25)",
                    border: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "var(--secondary)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 20px rgba(0, 200, 83, 0.35)",
                    },
                    fontSize: isMobile ? "0.9rem" : "1rem",
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
                    backgroundColor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    padding: isMobile ? "0 20px" : "0 24px",
                    height: isMobile ? "42px" : "48px",
                    fontWeight: 500,
                    letterSpacing: "0.3px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.25)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
                    },
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  Hesap Oluştur
                </Button>
              </Group>
              <Text
                size={isMobile ? "xs" : "sm"}
                mt="lg"
                className="hero-animate delay-300"
                style={{
                  opacity: 0.8,
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "0.2px",
                }}
              >
                *Tamamen ücretsiz, kayıt gerektiren bir hizmettir.
              </Text>
            </Box>

            {/* Sağdaki Animasyonlu İlaç İkonu */}
            {!isMobile && (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "320px",
                    height: "320px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 0 60px rgba(255, 255, 255, 0.2)",
                    animation: "pulse 5s infinite ease-in-out",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)",
                      transform: "rotate(45deg)",
                    }}
                  />
                  <IconPill
                    size={180}
                    stroke={1.5}
                    style={{
                      color: "white",
                      opacity: 0.95,
                      filter: "drop-shadow(0 0 20px rgba(255,255,255,0.4))",
                      animation: "float 4s infinite ease-in-out",
                    }}
                  />
                </div>
              </Box>
            )}
          </Group>
        </Box>

        {/* Features Section - Responsive & Modern */}
        <Box
          className="home-section light features-section"
          style={{ padding: isMobile ? "40px 0" : "80px 0" }}
        >
          <Container>
            <Box 
              mb={isMobile ? 30 : 60} 
              style={{ textAlign: "center" }}
              className="scroll-animate fade-up"
            >
              <Title
                order={2}
                mb="md"
                className="gradient-text"
                style={{
                  fontSize: isMobile ? "1.75rem" : "2.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontFamily: "'Montserrat', var(--font-geist-sans)",
                }}
              >
                Neler Yapabilirsin?
              </Title>
              <Text
                size={isMobile ? "sm" : "md"}
                style={{
                  maxWidth: "700px",
                  margin: "0 auto",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  letterSpacing: "0.2px",
                  fontFamily: "'Open Sans', var(--font-geist-sans)",
                }}
              >
                DrugLLM, ilaçlar hakkında bilgi sahibi olmanızı sağlayan
                gelişmiş özelliklere sahiptir
              </Text>
            </Box>

            <SimpleGrid
              cols={isMobile ? 1 : isSmallMobile ? 1 : 4}
              spacing={isMobile ? "xl" : 30}
            >
              {features.map((feature, index) => (
                <Card
                  key={index}
                  p="xl"
                  radius="md"
                  shadow="sm"
                  className={`card-hover scroll-animate fade-up delay-${(index + 1) * 100}`}
                  style={{
                    background: "white",
                    height: "100%",
                    border: "1px solid var(--border-color-light)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMobile ? "center" : "flex-start",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  <Box
                    className="feature-icon"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      background:
                        "linear-gradient(135deg, var(--primary-light) 0%, #BBDEFB 100%)",
                      color: "var(--primary)",
                      boxShadow: "0 8px 16px rgba(25, 118, 210, 0.15)",
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Title
                    order={4}
                    mb="sm"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--text-title)",
                      fontFamily: "'Montserrat', var(--font-geist-sans)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {feature.title}
                  </Title>

                  <Text
                    size="sm"
                    style={{
                      color: "var(--text-body)",
                      lineHeight: 1.6,
                      fontFamily: "'Open Sans', var(--font-geist-sans)",
                      letterSpacing: "0.1px",
                    }}
                  >
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
            padding: isMobile ? "40px 0" : "80px 0",
            marginTop: isMobile ? "20px" : "40px",
          }}
        >
          <Container>
            <Box
              mb={isMobile ? 30 : 60}
              style={{ textAlign: "center", position: "relative", zIndex: 2 }}
              className="scroll-animate fade-up"
            >
              <Title
                order={2}
                mb="md"
                className="gradient-text"
                style={{
                  fontSize: isMobile ? "1.75rem" : "2.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontFamily: "'Montserrat', var(--font-geist-sans)",
                }}
              >
                Teknolojinin Gücü
              </Title>
              <Text
                size={isMobile ? "sm" : "md"}
                style={{
                  maxWidth: "700px",
                  margin: "0 auto",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  letterSpacing: "0.2px",
                  fontFamily: "'Open Sans', var(--font-geist-sans)",
                }}
              >
                Gelişmiş yapay zeka algoritmalarımız sayesinde sağlık
                bilgilerine erişim artık çok daha kolay
              </Text>
            </Box>

            <SimpleGrid cols={isMobile ? 1 : 4} spacing={isMobile ? "xl" : 30}>
              {technologies.map((tech, index) => (
                <Card
                  key={index}
                  p="xl"
                  radius="lg"
                  shadow="sm"
                  className={`card-hover scroll-animate scale-up delay-${(index + 1) * 100}`}
                  style={{
                    background: "white",
                    height: "100%",
                    border: "1px solid var(--border-color-light)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMobile ? "center" : "flex-start",
                    textAlign: isMobile ? "center" : "left",
                    position: "relative",
                    zIndex: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    className="feature-icon"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      background:
                        "linear-gradient(135deg, var(--primary-light) 0%, #BBDEFB 100%)",
                      color: "var(--primary)",
                      boxShadow: "0 8px 16px rgba(25, 118, 210, 0.15)",
                    }}
                  >
                    {tech.icon}
                  </Box>

                  <Title
                    order={4}
                    mb="sm"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--text-title)",
                      fontFamily: "'Montserrat', var(--font-geist-sans)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {tech.title}
                  </Title>

                  <Text
                    size="sm"
                    style={{
                      color: "var(--text-body)",
                      lineHeight: 1.6,
                      fontFamily: "'Open Sans', var(--font-geist-sans)",
                      letterSpacing: "0.1px",
                    }}
                  >
                    {tech.description}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* FAQ Section - Modern */}
        <Box
          className="home-section light"
          style={{ padding: isMobile ? "40px 0" : "80px 0" }}
        >
          <Container>
            <Box 
              mb={isMobile ? 30 : 60} 
              style={{ textAlign: "center" }}
              className="scroll-animate fade-up"
            >
              <Title
                order={2}
                mb="md"
                className="gradient-text"
                style={{
                  fontSize: isMobile ? "1.75rem" : "2.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontFamily: "'Montserrat', var(--font-geist-sans)",
                }}
              >
                Sık Sorulan Sorular
              </Title>
              <Text
                size={isMobile ? "sm" : "md"}
                style={{
                  maxWidth: "700px",
                  margin: "0 auto",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  letterSpacing: "0.2px",
                  fontFamily: "'Open Sans', var(--font-geist-sans)",
                }}
              >
                DrugLLM ile ilgili merak ettiğiniz soruların cevaplarını burada
                bulabilirsiniz
              </Text>
            </Box>

            <Box
              className="scroll-animate fade-up delay-200"
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "1px solid var(--border-color-light)",
              }}
            >
              <Accordion variant="separated">
                {faqs.map((faq, index) => (
                  <Accordion.Item
                    key={index}
                    value={`item-${index}`}
                    style={{
                      border: "none",
                      backgroundColor: "white",
                      borderBottom:
                        index < faqs.length - 1
                          ? "1px solid var(--border-color-light)"
                          : "none",
                    }}
                  >
                    <Accordion.Control
                      style={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "var(--text-title)",
                        padding: "20px 24px",
                        fontFamily: "'Montserrat', var(--font-geist-sans)",
                      }}
                    >
                      {faq.question}
                    </Accordion.Control>
                    <Accordion.Panel
                      style={{
                        color: "var(--text-body)",
                        padding: "0 24px 20px",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        fontFamily: "'Open Sans', var(--font-geist-sans)",
                        letterSpacing: "0.1px",
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
            padding: isMobile ? "40px 0" : "80px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Container>
            <Box
              mb={isMobile ? 30 : 60}
              style={{ textAlign: "center", position: "relative", zIndex: 2 }}
              className="scroll-animate fade-up"
            >
              <Title
                order={2}
                mb="md"
                className="gradient-text"
                style={{
                  fontSize: isMobile ? "1.75rem" : "2.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontFamily: "'Montserrat', var(--font-geist-sans)",
                }}
              >
                Kullanıcı Yorumları
              </Title>
              <Text
                size={isMobile ? "sm" : "md"}
                style={{
                  maxWidth: "700px",
                  margin: "0 auto",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  letterSpacing: "0.2px",
                  fontFamily: "'Open Sans', var(--font-geist-sans)",
                }}
              >
                DrugLLM&apos;i kullanan profesyoneller ve hastalar ne diyor?
              </Text>
            </Box>

            <SimpleGrid cols={isMobile ? 1 : 3} spacing={isMobile ? "xl" : 30}>
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  p={0}
                  radius="lg"
                  className={`testimonial-card scroll-animate fade-up delay-${(index + 1) * 100}`}
                  style={{ position: "relative", zIndex: 2 }}
                >
                  <Box p="lg">
                    <Group position="apart" mb="md" align="flex-start">
                      <Group>
                        <Avatar
                          src={testimonial.image}
                          size="lg"
                          radius="xl"
                          style={{
                            border: "3px solid white",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Box>
                          <Text
                            fw={700}
                            size="sm"
                            style={{
                              color: "var(--text-title)",
                              fontFamily:
                                "'Montserrat', var(--font-geist-sans)",
                            }}
                          >
                            {testimonial.name}
                          </Text>
                          <Text size="xs" style={{ color: "var(--primary)" }}>
                            {testimonial.role}
                          </Text>
                        </Box>
                      </Group>
                      <ThemeIcon
                        size={36}
                        radius="xl"
                        style={{
                          backgroundColor: "var(--primary-light)",
                          color: "var(--primary)",
                        }}
                      >
                        <IconStar size={20} fill="var(--primary)" stroke={0} />
                      </ThemeIcon>
                    </Group>

                    <Text
                      size="sm"
                      style={{
                        lineHeight: 1.6,
                        color: "var(--text-body)",
                        fontStyle: "italic",
                        position: "relative",
                        paddingLeft: "8px",
                        fontFamily: "'Open Sans', var(--font-geist-sans)",
                        letterSpacing: "0.1px",
                      }}
                      component="div"
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "-6px",
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          borderRadius: "4px",
                          background:
                            "linear-gradient(180deg, var(--primary) 0%, var(--primary-light) 100%)",
                        }}
                      />
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
            padding: isMobile ? "40px 0" : "80px 0",
            position: "relative",
            marginBottom: isMobile ? "20px" : "40px",
          }}
        >
          <Container>
            <Card
              p={isSmallMobile ? "md" : isMobile ? "lg" : 50}
              radius="lg"
              shadow="md"
              className="scroll-animate scale-up"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, #1565C0 100%)",
                border: "none",
                position: "relative",
                overflow: "hidden",
                minHeight: isMobile ? "auto" : "280px",
              }}
            >
              {/* Arka plan dekoratif elementler */}
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: isMobile ? "150px" : "200px",
                  height: isMobile ? "150px" : "200px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "-30px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.05)",
                  zIndex: 1,
                }}
              />

              <Box 
                style={{ 
                  position: "relative", 
                  zIndex: 2,
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: isMobile ? "32px" : "40px",
                }}
              >
                <Box
                  style={{
                    flex: 1,
                    maxWidth: isMobile ? "100%" : "600px",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  <Title
                    order={2}
                    mb="md"
                    style={{
                      color: "white",
                      fontSize: isSmallMobile ? "1.25rem" : isMobile ? "1.5rem" : "2.25rem",
                      fontWeight: 800,
                      fontFamily: "'Montserrat', var(--font-geist-sans)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    Hemen Başlayın!
                  </Title>
                  <Text
                    color="white"
                    opacity={0.95}
                    mb={isMobile ? "lg" : "xl"}
                    size={isSmallMobile ? "xs" : isMobile ? "sm" : "lg"}
                    style={{
                      lineHeight: 1.7,
                      letterSpacing: "0.2px",
                      fontFamily: "'Open Sans', var(--font-geist-sans)",
                      fontWeight: 400,
                    }}
                  >
                    Ücretsiz hesabınızı oluşturun ve ilaçlar hakkında detaylı
                    bilgilere hemen ulaşın. Sağlığınız için doğru bilgi her
                    zaman önemlidir.
                  </Text>

                  <Group 
                    spacing={isMobile ? "sm" : "md"} 
                    position={isMobile ? "center" : "left"}
                    style={{
                      flexDirection: isSmallMobile ? "column" : "row",
                    }}
                  >
                    <Button
                      component={Link}
                      href="/login?tab=signup"
                      size={isMobile ? "md" : "lg"}
                      radius="md"
                      className="cta-button"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "white",
                        padding: isSmallMobile ? "0 20px" : "0 32px",
                        height: isSmallMobile ? "42px" : isMobile ? "46px" : "50px",
                        fontWeight: 600,
                        boxShadow: "0 10px 20px rgba(0, 200, 83, 0.25)",
                        border: "none",
                        transition: "all 0.3s ease",
                        fontSize: isSmallMobile ? "0.85rem" : "1rem",
                        minWidth: isSmallMobile ? "180px" : "auto",
                        "&:hover": {
                          backgroundColor: "var(--secondary)",
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 25px rgba(0, 200, 83, 0.35)",
                        },
                      }}
                    >
                      Ücretsiz Hesap Oluştur
                    </Button>
                    
                    <Button
                      component={Link}
                      href="/login"
                      size={isMobile ? "md" : "lg"}
                      radius="md"
                      variant="outline"
                      style={{
                        color: "white",
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        padding: isSmallMobile ? "0 20px" : "0 32px",
                        height: isSmallMobile ? "42px" : isMobile ? "46px" : "50px",
                        fontWeight: 500,
                        transition: "all 0.3s ease",
                        fontSize: isSmallMobile ? "0.85rem" : "1rem",
                        minWidth: isSmallMobile ? "120px" : "auto",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderColor: "rgba(255, 255, 255, 0.8)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Giriş Yap
                    </Button>
                  </Group>
                </Box>

                {!isMobile && (
                  <Box
                    style={{
                      flex: "0 0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ThemeIcon
                      size={180}
                      radius="xl"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        border: "2px solid rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <IconMessage size={90} stroke={1.2} />
                    </ThemeIcon>
                  </Box>
                )}
              </Box>
            </Card>
          </Container>
        </Box>

        {/* Footer - Light & Modern */}
        <Box
          component="footer"
          className="scroll-animate fade-up"
          style={{
            background: "var(--background-white)",
            marginTop: "60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          
          {/* Dekoratif geometrik şekiller */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(25, 118, 210, 0.03)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "rgba(0, 200, 83, 0.03)",
              filter: "blur(40px)",
            }}
          />
          
          <Container>
            <Box py={isMobile ? 40 : 60}>
              <Grid>
                <Grid.Col span={isMobile ? 12 : 8}>
                  <Stack spacing="lg">
                    <Group align="center" spacing="sm">
                      <ThemeIcon
                        size={44}
                        radius="lg"
                        style={{
                          background: "linear-gradient(135deg, var(--primary) 0%, #1565C0 100%)",
                          color: "white",
                        }}
                      >
                        <IconPill size={24} stroke={1.5} />
                      </ThemeIcon>
                      <Title
                        order={3}
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          fontFamily: "'Montserrat', var(--font-geist-sans)",
                        }}
                      >
                        DrugLLM
                      </Title>
                    </Group>
                    
                    <Text
                      size="sm"
                      style={{
                        color: "var(--text-muted)",
                        maxWidth: "400px",
                        lineHeight: 1.6,
                        fontFamily: "'Open Sans', var(--font-geist-sans)",
                      }}
                    >
                      Yapay zeka destekli ilaç bilgi asistanınız. Güvenilir, güncel ve kolay erişilebilir sağlık bilgileri için buradasınız.
                    </Text>

                    <Group spacing="xs">
                      <Badge 
                        color="green" 
                        variant="light" 
                        size="sm"
                        style={{ fontWeight: 500 }}
                      >
                        Ücretsiz
                      </Badge>
                      <Badge 
                        color="blue" 
                        variant="light" 
                        size="sm"
                        style={{ fontWeight: 500 }}
                      >
                        Güvenilir
                      </Badge>
                      <Badge 
                        color="violet" 
                        variant="light" 
                        size="sm"
                        style={{ fontWeight: 500 }}
                      >
                        AI Destekli
                      </Badge>
                    </Group>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={isMobile ? 12 : 4}>
                  <Stack spacing="lg" align={isMobile ? "center" : "flex-end"}>
                    <Box>
                      <Text
                        size="sm"
                        fw={600}
                        mb="sm"
                        style={{
                          color: "var(--text-title)",
                          fontFamily: "'Montserrat', var(--font-geist-sans)",
                          textAlign: isMobile ? "center" : "right",
                        }}
                      >
                        Bizi Takip Edin
                      </Text>
                      <Group 
                        spacing="sm" 
                        position={isMobile ? "center" : "right"}
                      >
                        <ActionIcon
                          size="xl"
                          radius="md"
                          variant="light"
                          color="blue"
                          className="social-icon"
                        >
                          <IconBrandTwitter size={20} />
                        </ActionIcon>
                        <ActionIcon
                          size="xl"
                          radius="md"
                          variant="light"
                          color="indigo"
                          className="social-icon"
                        >
                          <IconBrandFacebook size={20} />
                        </ActionIcon>
                        <ActionIcon
                          size="xl"
                          radius="md"
                          variant="light"
                          color="pink"
                          className="social-icon"
                        >
                          <IconBrandInstagram size={20} />
                        </ActionIcon>
                        <ActionIcon
                          size="xl"
                          radius="md"
                          variant="light"
                          color="red"
                          className="social-icon"
                        >
                          <IconBrandYoutube size={20} />
                        </ActionIcon>
                      </Group>
                    </Box>

                    <Box>
                      <Text
                        size="sm"
                        fw={600}
                        mb="sm"
                        style={{
                          color: "var(--text-title)",
                          fontFamily: "'Montserrat', var(--font-geist-sans)",
                          textAlign: isMobile ? "center" : "right",
                        }}
                      >
                        Hızlı Linkler
                      </Text>
                      <Stack 
                        spacing="xs" 
                        align={isMobile ? "center" : "flex-end"}
                      >
                        <Text
                          component={Link}
                          href="/docs"
                          size="sm"
                          style={{
                            color: "var(--text-body)",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                            "&:hover": {
                              color: "var(--primary)",
                            },
                          }}
                        >
                          Dokümantasyon
                        </Text>
                        <Text
                          component={Link}
                          href="/blog"
                          size="sm"
                          style={{
                            color: "var(--text-body)",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                            "&:hover": {
                              color: "var(--primary)",
                            },
                          }}
                        >
                          Blog
                        </Text>
                        <Text
                          component={Link}
                          href="/contact"
                          size="sm"
                          style={{
                            color: "var(--text-body)",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                            "&:hover": {
                              color: "var(--primary)",
                            },
                          }}
                        >
                          İletişim
                        </Text>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid.Col>
              </Grid>

              <Divider 
                my="xl" 
                style={{ 
                  borderColor: "var(--border-color-light)",
                  opacity: 0.6,
                }} 
              />

              <Group 
                position="apart" 
                align="center"
                style={{
                  flexDirection: isMobile ? "column-reverse" : "row",
                  gap: isMobile ? "16px" : "0",
                }}
              >
                <Text 
                  size="sm" 
                  style={{ 
                    color: "var(--text-muted)",
                    fontFamily: "'Open Sans', var(--font-geist-sans)",
                  }}
                >
                  © 2025 DrugLLM. Tüm hakları saklıdır.
                </Text>

                <Group spacing="lg">
                  <Text
                    component={Link}
                    href="/privacy"
                    size="sm"
                    style={{
                      color: "var(--text-body)",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "var(--primary)",
                      },
                    }}
                  >
                    Gizlilik Politikası
                  </Text>
                  <Text
                    component={Link}
                    href="/terms"
                    size="sm"
                    style={{
                      color: "var(--text-body)",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "var(--primary)",
                      },
                    }}
                  >
                    Kullanım Şartları
                  </Text>
                </Group>
              </Group>
            </Box>
          </Container>
        </Box>
      </Container>

      {/* Yukarı Çıkma Butonu - Basitleştirilmiş */}
      <Button
        onClick={scrollToTop}
        id="scrollTopButton"
        ref={scrollButtonRef}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#1976D2",
          color: "white",
          border: "none",
          boxShadow: "0 4px 15px rgba(25, 118, 210, 0.5)",
          cursor: "pointer",
          display: "none", // Başlangıçta gizli, JavaScript ile kontrol edilecek
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          fontSize: "24px",
          fontWeight: "bold",
        }}
        aria-label="Yukarı çık"
      >
        ↑
      </Button>
    </Box>
  );
}
