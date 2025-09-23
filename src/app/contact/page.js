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
  Textarea,
  Select,
  Stack,
  Grid,
  Card,
  ThemeIcon,
  Alert,
  Anchor,
  Breadcrumbs,
  Divider
} from '@mantine/core';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconClock,
  IconSend,
  IconUser,
  IconMessage,
  IconCheck,
  IconAlertCircle,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandInstagram
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function ContactPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactCategories = [
    { value: 'general', label: 'Genel Sorular' },
    { value: 'technical', label: 'Teknik Destek' },
    { value: 'business', label: 'İş Ortaklığı' },
    { value: 'feedback', label: 'Geri Bildirim' },
    { value: 'bug', label: 'Hata Bildirimi' },
    { value: 'feature', label: 'Özellik Önerisi' }
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
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });
  };

  const breadcrumbItems = [
    { title: 'Ana Sayfa', href: '/' },
    { title: 'İletişim', href: '/contact' }
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const contactInfo = [
    {
      icon: <IconMail size={24} />,
      title: 'E-posta',
      info: 'drugllm@trizglobal.com.tr',
      subInfo: 'Destek için: info@trizglobal.com.tr',
      color: 'blue'
    },
    {
      icon: <IconPhone size={24} />,
      title: 'Telefon',
      info: '+90 (264) 000 00 00',
      subInfo: 'Pazartesi - Cuma: 09:00 - 18:00',
      color: 'green'
    },
    {
      icon: <IconMapPin size={24} />,
      title: 'Adres',
      info: 'Yazlık Mah. 4429.Sokak',
      subInfo: 'Serdivan, Sakarya, Türkiye',
      color: 'red'
    },
    {
      icon: <IconClock size={24} />,
      title: 'Çalışma Saatleri',
      info: 'Pazartesi - Cuma: 09:00 - 18:00',
      subInfo: 'Cumartesi: 10:00 - 16:00',
      color: 'orange'
    }
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
              Bizimle İletişime Geçin
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
              Sorularınız, önerileriniz veya destek talepleriniz için buradayız.
              En kısa sürede size geri dönüş yapacağız.
            </Text>
          </Box>

          <Grid>
            <Grid.Col span={isMobile ? 12 : 8}>
              <Paper shadow="sm" radius="md" p="xl">
                <Title order={2} mb="lg">
                  <Group spacing="sm">
                    <IconMessage size={24} color="var(--primary)" />
                    Mesaj Gönderin
                  </Group>
                </Title>

                {submitted && (
                  <Alert 
                    icon={<IconCheck size={16} />} 
                    color="green" 
                    mb="lg"
                    title="Mesajınız başarıyla gönderildi!"
                  >
                    En kısa sürede size geri dönüş yapacağız. Teşekkür ederiz.
                  </Alert>
                )}

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
                          label="Kategori"
                          placeholder="Mesaj kategorisini seçin"
                          data={contactCategories}
                          value={formData.category}
                          onChange={(value) => handleInputChange('category', value)}
                          required
                        />
                      </Grid.Col>
                      <Grid.Col span={isMobile ? 12 : 6}>
                        <TextInput
                          label="Konu"
                          placeholder="Mesajınızın konusunu girin"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          required
                        />
                      </Grid.Col>
                    </Grid>

                    <Textarea
                      label="Mesaj"
                      placeholder="Mesajınızı buraya yazın..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      minRows={5}
                      autosize
                    />

                    <Alert 
                      icon={<IconAlertCircle size={16} />} 
                      color="blue" 
                      variant="light"
                    >
                      <Text size="sm">
                        <strong>Gizlilik:</strong> Gönderdiğiniz bilgiler güvenli şekilde işlenir ve 
                        sadece destek amacıyla kullanılır. Kişisel verileriniz üçüncü taraflarla paylaşılmaz.
                      </Text>
                    </Alert>

                                      <Group position="right">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      leftSection={<IconSend size={16} />}
                      size="md"
                    >
                      {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                    </Button>
                  </Group>
                  </Stack>
                </form>
              </Paper>
            </Grid.Col>

            {/* İletişim Bilgileri */}
            <Grid.Col span={isMobile ? 12 : 4}>
              <Stack spacing="md">
                {contactInfo.map((item, index) => (
                  <Card key={index} shadow="sm" radius="md" p="md">
                    <Group spacing="md" align="flex-start">
                      <ThemeIcon size={50} radius="md" color={item.color} variant="light">
                        {item.icon}
                      </ThemeIcon>
                      <Box style={{ flex: 1 }}>
                        <Text size="sm" weight={600} mb="xs">
                          {item.title}
                        </Text>
                        <Text size="sm" mb="xs">
                          {item.info}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {item.subInfo}
                        </Text>
                      </Box>
                    </Group>
                  </Card>
                ))}

                {/* Sosyal Medya */}
                <Card shadow="sm" radius="md" p="md">
                  <Text size="sm" weight={600} mb="md">
                    Sosyal Medya
                  </Text>
                  <Group spacing="md">
                    <ThemeIcon size={40} radius="md" color="blue" variant="light" style={{ cursor: 'pointer' }}>
                      <IconBrandTwitter size={20} />
                    </ThemeIcon>
                    <ThemeIcon size={40} radius="md" color="blue" variant="light" style={{ cursor: 'pointer' }}>
                      <IconBrandLinkedin size={20} />
                    </ThemeIcon>
                    <ThemeIcon size={40} radius="md" color="pink" variant="light" style={{ cursor: 'pointer' }}>
                      <IconBrandInstagram size={20} />
                    </ThemeIcon>
                  </Group>
                  <Text size="xs" color="dimmed" mt="sm">
                    Güncellemeler ve duyurular için takip edin
                  </Text>
                </Card>

                {/* Hızlı Linkler */}
                <Card shadow="sm" radius="md" p="md">
                  <Text size="sm" weight={600} mb="md">
                    Hızlı Linkler
                  </Text>
                  <Stack spacing="xs">
                    <Anchor component={Link} href="/docs" size="sm">
                      Dokümantasyon
                    </Anchor>
                    <Anchor component={Link} href="/blog" size="sm">
                      Blog
                    </Anchor>
                    <Anchor component={Link} href="/chat" size="sm">
                      DrugLLM Deneyin
                    </Anchor>
                    <Divider />
                    <Text size="xs" color="dimmed">
                      SSS ve Yardım sayfalarımızı ziyaret edin
                    </Text>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>

          {/* FAQ Bölümü */}
          <Paper shadow="sm" radius="md" p="xl" mt="xl">
            <Title order={2} mb="lg" style={{ textAlign: 'center' }}>
              Sık Sorulan Sorular
            </Title>
            <Grid>
              <Grid.Col span={isMobile ? 12 : 6}>
                <Stack spacing="md">
                  <Box>
                    <Text weight={500} mb="xs">DrugLLM nasıl çalışır?</Text>
                    <Text size="sm" color="dimmed">
                      DrugLLM, yapay zeka teknolojisi kullanarak ilaç bilgilerini analiz eder ve 
                      kişiselleştirilmiş yanıtlar sunar.
                    </Text>
                  </Box>
                  <Box>
                    <Text weight={500} mb="xs">Verilerim güvende mi?</Text>
                    <Text size="sm" color="dimmed">
                      Evet, tüm verileriniz şifrelenerek güvenli sunucularda saklanır ve 
                      gizlilik politikamıza uygun şekilde işlenir.
                    </Text>
                  </Box>
                </Stack>
              </Grid.Col>
              <Grid.Col span={isMobile ? 12 : 6}>
                <Stack spacing="md">
                  <Box>
                    <Text weight={500} mb="xs">Ücretsiz mi?</Text>
                    <Text size="sm" color="dimmed">
                      Şu anda DrugLLM beta aşamasında ve ücretsiz olarak sunulmaktadır. 
                      Gelecek planlarımız hakkında blog sayfamızdan bilgi alabilirsiniz.
                    </Text>
                  </Box>
                  <Box>
                    <Text weight={500} mb="xs">Destek nasıl alırım?</Text>
                    <Text size="sm" color="dimmed">
                      Bu sayfadaki formu kullanarak bize ulaşabilir veya 
                      support@drugllm.com adresine e-posta gönderebilirsiniz.
                    </Text>
                  </Box>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Harita veya Ek Bilgi */}
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
            <Title order={3} mb="md">
              DrugLLM Topluluğuna Katılın
            </Title>
            <Text mb="lg" style={{ opacity: 0.9 }}>
              İlaç bilimi ve teknoloji konularında güncel kalın, 
              uzmanlarla iletişim kurun ve topluluğumuzun bir parçası olun.
            </Text>
            <Group position="center">
              <Button 
                component={Link} 
                href="/login?tab=signup" 
                variant="white" 
                color="dark" 
                size="md"
              >
                Ücretsiz Üye Olun
              </Button>
              <Button 
                component={Link} 
                href="/blog" 
                variant="outline" 
                size="md"
                style={{ borderColor: 'white', color: 'white' }}
              >
                Blog&apos;u İnceleyin
              </Button>
            </Group>
          </Paper>
        </Container>
      </Box>
    </>
  );
} 