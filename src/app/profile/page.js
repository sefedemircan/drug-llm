"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Box, 
  Container, 
  Title, 
  Text,
  LoadingOverlay,
  Alert,
  Paper,
  Group,
  Button,
  Avatar,
  Grid,
  Badge,
  Card,
  Divider,
  ActionIcon,
  useMantineTheme,
  Tooltip,
  SimpleGrid,
  ThemeIcon
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconAlertCircle, 
  IconUserCircle, 
  IconHeartRhythm, 
  IconArrowLeft, 
  IconEdit, 
  IconHeartbeat, 
  IconPill, 
  IconAlertTriangle, 
  IconApple, 
  IconClipboardList, 
  IconBuildingHospital, 
  IconActivity 
} from '@tabler/icons-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingStep, setLoadingStep] = useState("başlatılıyor");
  const [profileData, setProfileData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, router]);

  // Tüm kullanıcı verilerini çekme
  const fetchUserData = async () => {
    try {
      // Kullanıcı giriş yapmış mı kontrol ediyoruz
      if (!user || !user.id) {
        setError("Oturum bilgisi alınamadı, lütfen tekrar giriş yapın");
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      
      // Profil bilgilerini çek
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileError) {
        console.error("Profil bilgileri alınırken hata:", profileError);
        setError("Profil bilgileri alınamadı: " + profileError.message);
      } else {
        setProfileData(profileData);
      }
      
      // Sağlık bilgilerini çek
      const { data: healthData, error: healthError } = await supabase
        .from('health_info')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (healthError) {
        console.error("Sağlık bilgileri alınırken hata:", healthError);
        setError("Sağlık bilgileri alınamadı: " + healthError.message);
      } else {
        setHealthData(healthData);
      }
      
      setPageLoading(false);
    } catch (error) {
      console.error("Kullanıcı verileri alınırken hata:", error);
      setError("Kullanıcı verileri alınamadı: " + (error.message || 'Bilinmeyen hata'));
      setPageLoading(false);
    }
  };

  if (loading || !user) {
    return <LoadingSpinner fullScreen message="Profiliniz yükleniyor" />;
  }

  // Kullanıcı adını oluştur (Ad Soyad veya Email'den)
  const userName = profileData?.full_name || user?.email?.split('@')[0] || "Kullanıcı";

  // Kullanıcı baş harflerini oluştur (Avatar için)
  const initials = profileData?.full_name
    ? profileData.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase().substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || "KA";

  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        background: 'linear-gradient(180deg, rgba(235,244,255,0.8) 0%, rgba(240,248,255,0.4) 100%)',
        paddingBottom: '40px'
      }}
    >
      <Container size="lg" py={isMobile ? "md" : "xl"}>
      <LoadingOverlay 
        visible={pageLoading}
        loader={<LoadingSpinner message={`Yükleniyor (${loadingStep})`} />}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        
        {/* Header */}
        <Box mb="xl">
          <Group position="apart" mb="lg">
            <Group>
              <ActionIcon 
                size="lg" 
                radius="xl" 
                variant="light"
                color="blue"
                onClick={() => router.push('/chat')}
              >
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Title 
                order={isMobile ? 3 : 2}
                style={{ 
                  fontSize: isMobile ? '1.5rem' : '2rem', 
                  color: 'var(--primary)',
                  fontWeight: 700
                }}
              >
                Profilim
              </Title>
            </Group>
            <Tooltip label="Profili Düzenle">
              <ActionIcon 
                size="lg" 
                radius="xl" 
                variant="light" 
                color="blue"
              >
                <IconEdit size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
          
          <Alert 
            color="blue"
            radius="md"
            mb="xl"
            icon={<IconAlertCircle size={16} />}
            sx={{
              border: '1px solid rgba(25, 118, 210, 0.2)',
              background: 'rgba(25, 118, 210, 0.05)'
            }}
          >
            Bilgileriniz ilaç tavsiyelerini kişiselleştirmek için kullanılacak ve güvenle saklanacaktır.
          </Alert>
      
      {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Hata" 
              color="red" 
              mb="md"
              radius="md"
              withBorder
            >
          {error}
        </Alert>
      )}
      
      {success && (
            <Alert title="Başarılı" color="green" mb="md" radius="md" withBorder>
          {success}
        </Alert>
      )}
        </Box>
        
        {/* Kullanıcı Profil Kartı */}
        <Card 
          withBorder 
          shadow="sm" 
          radius="md" 
          mb="xl"
          padding="xl"
          sx={{ 
            background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)',
            borderColor: 'rgba(25, 118, 210, 0.2)',
            overflow: 'visible'
          }}
        >
          <Grid gutter={isMobile ? "md" : "xl"}>
            <Grid.Col span={isMobile ? 12 : 4} style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
              <Avatar 
                size={120} 
                radius={60} 
                color="white" 
                style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  border: '4px solid white',
                  backgroundColor: 'var(--primary)',
                  marginBottom: '16px'
                }}
              >
                {initials}
              </Avatar>
              <Title order={3} weight={700} style={{ color: 'var(--text-title)', marginBottom: '4px' }}>
                {userName}
              </Title>
              <Text size="sm" color="dimmed" mb="sm">
                {user?.email}
              </Text>
              <Badge 
                color="primary" 
                size="lg" 
                radius="sm" 
                style={{
                  
                  background: 'linear-gradient(90deg, var(--primary) 0%, #1a95e9 100%)',
                  padding: '8px 16px'
                }}
              >
                DrugLLM Kullanıcısı
              </Badge>
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 12 : 8}>
      {profileData && (
                <div>
                  <Group position="apart" mb="md">
                    <Title order={4} style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      <IconUserCircle size={20} style={{ marginRight: '8px', display: 'inline' }} />
                      Kişisel Bilgiler
                    </Title>
                  </Group>
                  
                  <SimpleGrid cols={isMobile ? 1 : 2} spacing="md" mb="md">
                    <ProfileInfoItem label="Adı Soyadı" value={profileData.full_name} />
                    <ProfileInfoItem 
                      label="Doğum Tarihi" 
                      value={new Date(profileData.birth_date).toLocaleDateString('tr-TR')} 
                    />
                    <ProfileInfoItem label="Cinsiyet" value={profileData.gender} />
                    <ProfileInfoItem label="Boy" value={`${profileData.height} cm`} />
                    <ProfileInfoItem label="Kilo" value={`${profileData.weight} kg`} />
                    <ProfileInfoItem label="Telefon" value={profileData.phone} />
                  </SimpleGrid>
                  
                  <ProfileInfoItem 
                    label="Adres" 
                    value={profileData.address} 
                    fullWidth 
                  />
                  
                  <Divider variant="dashed" my="md" />
                  
                  <ProfileInfoItem 
                    label="Acil Durumda Aranacak Kişi" 
                    value={profileData.emergency_contact} 
                    fullWidth
                    important
                  />
                </div>
              )}
            </Grid.Col>
          </Grid>
        </Card>
        
        {/* Sağlık Bilgileri Kartları */}
        {healthData && (
          <SimpleGrid cols={isMobile ? 1 : 2} spacing={isMobile ? "md" : "lg"}>
            {/* Kan Grubu ve Genel Sağlık */}
            <Card 
              withBorder 
              shadow="sm" 
              radius="md" 
              padding="lg"
              sx={{
                borderColor: 'rgba(25, 118, 210, 0.2)',
                background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)',
              }}
            >
              <Card.Section bg="var(--primary)" py="sm" px="lg">
                <Group position="apart">
                  <Group>
                    <ThemeIcon size="lg" radius="md" color="red" variant="light">
                      <IconHeartbeat size={20} />
                    </ThemeIcon>
                    <Title order={4} style={{ fontWeight: 700, color: 'white' }}>
                      Temel Sağlık Bilgileri
                    </Title>
                  </Group>
                </Group>
              </Card.Section>
              
              <Box mt="md">
                <Group position="center" mb="md">
                  <Badge 
                    size="xl" 
                    radius="sm" 
                    color="red" 
                    style={{ 
                      padding: '16px 24px', 
                      fontSize: '1.2rem', 
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #ff5757 0%, #ff4040 100%)',
                    }}
                  >
                    Kan Grubu: {healthData.blood_type}
                  </Badge>
                </Group>
                
                <Divider variant="dashed" mb="md" />
                
                <Text weight={600} mb="xs" color="dimmed" size="sm">Kronik Hastalıklar:</Text>
                {healthData.chronic_diseases?.length > 0 ? (
                  <Group spacing="xs" mb="md">
                    {healthData.chronic_diseases.map((disease, i) => (
                      <Badge key={i} color="violet" variant="light" radius="sm" size="md">{disease}</Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="sm" mb="md">Yok</Text>
                )}
                
                <Text weight={600} mb="xs" color="dimmed" size="sm">Tıbbi Geçmiş:</Text>
                <Text size="sm" mb="md" style={{ lineHeight: 1.6 }}>
                  {healthData.medical_history || 'Bilgi girilmemiş'}
                </Text>
                
                <Text weight={600} mb="xs" color="dimmed" size="sm">Aile Sağlık Geçmişi:</Text>
                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  {healthData.family_history || 'Bilgi girilmemiş'}
                </Text>
              </Box>
            </Card>
            
            {/* İlaçlar ve Alerjiler Kartı */}
            <Card 
              withBorder 
              shadow="sm" 
              radius="md" 
              padding="lg"
              sx={{
                borderColor: 'rgba(25, 118, 210, 0.2)',
                background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)',
              }}
            >
              <Card.Section bg="var(--secondary)" py="sm" px="lg">
                <Group position="apart">
                  <Group>
                    <ThemeIcon size="lg" radius="md" color="var(--primary)" variant="light">
                      <IconPill size={20} />
                    </ThemeIcon>
                    <Title order={4} style={{ fontWeight: 700, color: 'white' }}>
                      İlaçlar ve Alerjiler
                    </Title>
                  </Group>
                </Group>
              </Card.Section>
              
              <Box mt="md">
                <Text weight={600} mb="xs" color="dimmed" size="sm">Kullandığı İlaçlar:</Text>
                {healthData.current_medications?.length > 0 ? (
                  <Group spacing="xs" mb="md">
                    {healthData.current_medications.map((med, i) => (
                      <Badge key={i} color="blue" variant="light" radius="sm" size="md">{med}</Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="sm" mb="md">Yok</Text>
                )}
                
                <Divider variant="dashed" mb="md" />
                
                <Text weight={600} mb="xs" color="dimmed" size="sm">İlaç Alerjileri:</Text>
                {healthData.drug_allergies?.length > 0 ? (
                  <Group spacing="xs" mb="md">
                    {healthData.drug_allergies.map((allergy, i) => (
                      <Badge key={i} color="red" variant="light" radius="sm" size="md">{allergy}</Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="sm" mb="md">Yok</Text>
                )}
                
                <Text weight={600} mb="xs" color="dimmed" size="sm">Gıda Alerjileri:</Text>
                {healthData.food_allergies?.length > 0 ? (
                  <Group spacing="xs" mb="md">
                    {healthData.food_allergies.map((allergy, i) => (
                      <Badge key={i} color="yellow" variant="light" radius="sm" size="md">{allergy}</Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="sm" mb="md">Yok</Text>
                )}
                
                <Text weight={600} mb="xs" color="dimmed" size="sm">Yaşam Tarzı Bilgileri:</Text>
                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  {healthData.lifestyle_info || 'Bilgi girilmemiş'}
                </Text>
              </Box>
            </Card>
          </SimpleGrid>
        )}
        
        {/* Alt Butonlar */}
        <Group position="apart" mt="xl">
        <Button 
            variant="light" 
            color="blue"
            radius="md"
            leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.push('/chat')}
            size={isMobile ? "sm" : "md"}
          >
            Sohbete Dön
          </Button>
          
          <Button 
            variant="gradient" 
            gradient={{ from: 'blue', to: 'cyan' }}
            radius="md"
            onClick={() => fetchUserData()}
            size={isMobile ? "sm" : "md"}
          >
            Bilgileri Güncelle
        </Button>
      </Group>
    </Container>
    </Box>
  );
}

// Yardımcı Bileşen: Profil Bilgisi Satırı
function ProfileInfoItem({ label, value, fullWidth = false, important = false }) {
  return (
    <Box 
      mb={fullWidth ? "md" : 0} 
      p="xs" 
      style={{ 
        borderRadius: '8px',
        backgroundColor: important ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        border: important ? '1px dashed rgba(25, 118, 210, 0.3)' : 'none'
      }}
    >
      <Text 
        size="sm" 
        weight={600} 
        style={{ 
          color: 'var(--text-muted)', 
          marginBottom: '4px'
        }}
      >
        {label}
      </Text>
      <Text 
        style={{ 
          fontWeight: important ? 600 : 500, 
          color: important ? 'var(--primary)' : 'var(--text-body)',
          fontSize: important ? '0.95rem' : '0.9rem'
        }}
      >
        {value || 'Belirtilmemiş'}
      </Text>
    </Box>
  );
} 