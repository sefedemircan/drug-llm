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
  TextInput,
  Select,
  Stack,
  Grid,
  Card,
  ThemeIcon,
  Alert,
  Anchor,
  Breadcrumbs,
  List,
  Badge,
  NumberInput
} from '@mantine/core';
import {
  IconRocket,
  IconUsers,
  IconCheck,
  IconStar,
  IconMail,
  IconUser,
  IconBriefcase,
  IconHeartbeat,
  IconShield,
  IconGift,
  IconCrown,
  IconBell
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function AccessPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    organization: '',
    experience: '',
    useCase: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const professionOptions = [
    { value: 'doctor', label: 'Doktor' },
    { value: 'pharmacist', label: 'Eczacı' },
    { value: 'nurse', label: 'Hemşire' },
    { value: 'researcher', label: 'Arastirmaci' },
    { value: 'student', label: 'Öğrenci' },
    { value: 'other', label: 'Diğer' }
  ];

  const useCaseOptions = [
    { value: 'clinical', label: 'Klinik Karar Desteği' },
    { value: 'education', label: 'Egitim ve Öğretim' },
    { value: 'research', label: 'Araştırma' },
    { value: 'personal', label: 'Kişisel Kullanım' },
    { value: 'other', label: 'Diğer' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const breadcrumbItems = [
    { title: 'Ana Sayfa', href: '/' },
    { title: 'Erken Erisim', href: '/access' }
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const benefits = [
    {
      icon: <IconRocket size={24} />,
      title: 'Ilk Erisim',
      description: 'Yeni ozellikleri herkesten once deneyin',
      color: 'blue'
    },
    {
      icon: <IconUsers size={24} />,
      title: 'Topluluk',
      description: 'Uzmanlarla dogrudan iletisim kurun',
      color: 'green'
    },
    {
      icon: <IconStar size={24} />,
      title: 'Ozel Destek',
      description: 'Oncelikli teknik destek alin',
      color: 'yellow'
    },
    {
      icon: <IconGift size={24} />,
      title: 'Ucretsiz Erisim',
      description: 'Beta doneminde tamamen ucretsiz',
      color: 'purple'
    }
  ];

  const features = [
    'Gelişmiş AI ilaç analizi',
    'Kişiselleştirilmiş öneriler',
    'Etkileşim kontrolu',
    'Yan etki uyarıları',
    'Dozaj hesaplayicisi',
    'Literatür taraması',
    'Klinik karar desteği',
    'API erişimi'
  ];

  const stats = [
    { label: 'Beta Kullanıcısı', value: 1247, suffix: '+' },
    { label: 'İlaç Bilgisi', value: 25000, suffix: '+' },
    { label: 'Günlük Soru', value: 850, suffix: '+' },
    { label: 'Memnuniyet', value: 96, suffix: '%' }
  ];

  return (
    <>
      <Navbar />
      <Box 
        style={{ 
          minHeight: '100vh',
          backgroundColor: 'var(--chat-bg)',
          paddingTop: isMobile ? '100px' : '120px'
        }}
      >
        <Container size="xl" py="xl">
          <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

          <Box mb="xl" style={{ textAlign: 'center' }}>
            <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="md">
              BETA PROGRAMI
            </Badge>
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
              DrugLLM Erken Erisim
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
              Geleceğin ilaç bilgi sistemini şimdiden deneyimleyin. 
              Beta programımıza katılın ve özel avantajlardan yararlanın.
            </Text>
          </Box>

          <Grid mb="xl">
            {stats.map((stat, index) => (
              <Grid.Col key={index} span={isMobile ? 6 : 3}>
                <Paper shadow="sm" radius="md" p="md" style={{ textAlign: 'center' }}>
                  <Text size="xl" weight={700} color="var(--primary)">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {stat.label}
                  </Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>

          <Grid>
            <Grid.Col span={isMobile ? 12 : 8}>
              <Paper shadow="sm" radius="md" p="xl">
                <Group mb="lg">
                  <ThemeIcon size={40} radius="md" color="blue" variant="light">
                    <IconCrown size={24} />
                  </ThemeIcon>
                  <Box>
                    <Title order={2}>Beta Programına Katılın</Title>
                    <Text color="dimmed">
                      Formu doldurun ve öncelikli erisim kazanin
                    </Text>
                  </Box>
                </Group>

                {submitted ? (
                  <Alert 
                    icon={<IconCheck size={16} />} 
                    color="green" 
                    title="Başvurunuz alindi!"
                  >
                    <Text mb="sm">
                      Başvurunuz başarıyla kaydedildi. En kısa sürede size geri dönüş yapacagiz.
                    </Text>
                    <Text size="sm" color="dimmed">
                      Beta erisim kodu e-posta adresinize gönderilecektir.
                    </Text>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing="md">
                      <Grid>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <TextInput
                            label="Ad Soyad"
                            placeholder="Adınızı ve soyadınızı girin"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            icon={<IconUser size={16} />}
                          />
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <TextInput
                            label="E-posta"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            icon={<IconMail size={16} />}
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Select
                            label="Meslek"
                            placeholder="Mesleginizi seçin"
                            data={professionOptions}
                            value={formData.profession}
                            onChange={(value) => handleInputChange('profession', value)}
                            required
                            icon={<IconBriefcase size={16} />}
                          />
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <TextInput
                            label="Kurum/Organizasyon"
                            placeholder="Çalıştığınız kurum"
                            value={formData.organization}
                            onChange={(e) => handleInputChange('organization', e.target.value)}
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <NumberInput
                            label="Deneyim (Yıl)"
                            placeholder="0"
                            value={formData.experience}
                            onChange={(value) => handleInputChange('experience', value)}
                            min={0}
                            max={50}
                          />
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Select
                            label="Kullanım Amacı"
                            placeholder="Nasıl kullanmayı planlıyorsunuz?"
                            data={useCaseOptions}
                            value={formData.useCase}
                            onChange={(value) => handleInputChange('useCase', value)}
                            required
                          />
                        </Grid.Col>
                      </Grid>

                      <Alert 
                        icon={<IconBell size={16} />} 
                        color="blue" 
                        variant="light"
                      >
                        <Text size="sm">
                          Beta programı sınırlı sayıda kullanıcı ile gerçekleştirilmektedir. 
                          Başvurunuz değerlendirildikten sonra size bilgi verilecektir.
                        </Text>
                      </Alert>

                      <Group position="right">
                        <Button
                          type="submit"
                          loading={isSubmitting}
                          leftSection={<IconRocket size={16} />}
                          size="md"
                        >
                          {isSubmitting ? 'Gönderiliyor...' : 'Beta Programına Katıl'}
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                )}
              </Paper>
            </Grid.Col>

            <Grid.Col span={isMobile ? 12 : 4}>
              <Stack spacing="md">
                <Paper shadow="sm" radius="md" p="md">
                  <Title order={3} mb="md">
                    <Group spacing="sm">
                      <IconStar size={20} color="var(--primary)" />
                      Beta Avantajları
                    </Group>
                  </Title>
                  <Stack spacing="sm">
                    {benefits.map((benefit, index) => (
                      <Group key={index} spacing="sm" align="flex-start">
                        <ThemeIcon size={35} radius="md" color={benefit.color} variant="light">
                          {benefit.icon}
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" weight={500} mb="xs">
                            {benefit.title}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {benefit.description}
                          </Text>
                        </Box>
                      </Group>
                    ))}
                  </Stack>
                </Paper>

                <Paper shadow="sm" radius="md" p="md">
                  <Title order={3} mb="md">
                    <Group spacing="sm">
                      <IconHeartbeat size={20} color="var(--primary)" />
                      Beta Özellikleri
                    </Group>
                  </Title>
                  <List spacing="xs" size="sm">
                    {features.map((feature, index) => (
                      <List.Item key={index} icon={<IconCheck size={14} color="green" />}>
                        {feature}
                      </List.Item>
                    ))}
                  </List>
                </Paper>

                <Paper shadow="sm" radius="md" p="md">
                  <Group spacing="sm" mb="md">
                    <IconShield size={20} color="var(--primary)" />
                    <Title order={3}>Güvenlik & Gizlilik</Title>
                  </Group>
                  <Stack spacing="xs">
                    <Text size="sm">✓ End-to-end şifreleme</Text>
                    <Text size="sm">✓ GDPR uyumlu veri işleme</Text>
                    <Text size="sm">✓ Türkiye sunucularında depolama</Text>
                    <Text size="sm">✓ Kişisel veri koruması</Text>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>

          <Paper 
            shadow="sm" 
            radius="md" 
            p="xl" 
            mt="xl"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <Title order={3} mb="md">Hazır mısınız?</Title>
            <Text mb="lg" style={{ opacity: 0.9 }}>
              Sağlık teknolojisinin gelecegini sekillendiren bu yolculuga katilin.
            </Text>
            <Group position="center">
              <Button 
                component={Link} 
                href="/chat" 
                variant="white" 
                color="dark" 
                size="md"
                leftSection={<IconRocket size={16} />}
              >
                Şimdi Deneyin
              </Button>
              <Button 
                component={Link} 
                href="/docs" 
                variant="outline" 
                size="md"
                style={{ borderColor: 'white', color: 'white' }}
              >
                Dokümantasyon
              </Button>
            </Group>
          </Paper>
        </Container>
      </Box>
    </>
  );
} 