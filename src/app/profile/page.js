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
  Button
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingStep, setLoadingStep] = useState("başlatılıyor");
  const [profileData, setProfileData] = useState(null);
  const [healthData, setHealthData] = useState(null);

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

  return (
    <Container size="md" py="xl">
      <LoadingOverlay 
        visible={pageLoading}
        loader={<LoadingSpinner message={`Yükleniyor (${loadingStep})`} />}
      />
      
      <Title order={2} mb="md">Kullanıcı Bilgilerim</Title>
      <Text color="dimmed" mb="xl">
        Bu bilgiler ilaç tavsiyelerini kişiselleştirmek ve olası etkileşimleri önlemek için kullanılacaktır. 
        Bilgileriniz güvenli şekilde saklanacak ve izniniz olmadan paylaşılmayacaktır.
      </Text>
      
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Hata" color="red" mb="md">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert title="Başarılı" color="green" mb="md">
          {success}
        </Alert>
      )}

      {profileData && (
        <Paper shadow="xs" p="md" withBorder mb="lg">
          <Title order={4} mb="md">Profil Bilgileri</Title>
          <Text><strong>Ad Soyad:</strong> {profileData.full_name}</Text>
          <Text><strong>Doğum Tarihi:</strong> {new Date(profileData.birth_date).toLocaleDateString('tr-TR')}</Text>
          <Text><strong>Cinsiyet:</strong> {profileData.gender}</Text>
          <Text><strong>Boy:</strong> {profileData.height} cm</Text>
          <Text><strong>Kilo:</strong> {profileData.weight} kg</Text>
          <Text><strong>Telefon:</strong> {profileData.phone}</Text>
          <Text><strong>Adres:</strong> {profileData.address}</Text>
          <Text><strong>Acil Servis Kişisi:</strong> {profileData.emergency_contact}</Text>
        </Paper>
      )}

      {healthData && (
        <Paper shadow="xs" p="md" withBorder mb="lg">
          <Title order={4} mb="md">Sağlık Bilgileri</Title>
          <Text><strong>Kan Grubu:</strong> {healthData.blood_type}</Text>
          <Text><strong>Kronik Hastalıklar:</strong> {healthData.chronic_diseases?.join(', ') || 'Yok'}</Text>
          <Text><strong>Kullandığı İlaçlar:</strong> {healthData.current_medications?.join(', ') || 'Yok'}</Text>
          <Text><strong>İlaç Alerjileri:</strong> {healthData.drug_allergies?.join(', ') || 'Yok'}</Text>
          <Text><strong>Gıda Alerjileri:</strong> {healthData.food_allergies?.join(', ') || 'Yok'}</Text>
          <Text><strong>Tıbbi Geçmiş:</strong> {healthData.medical_history || 'Yok'}</Text>
          <Text><strong>Aile Sağlık Geçmişi:</strong> {healthData.family_history || 'Yok'}</Text>
          <Text><strong>Yaşam Tarzı Bilgileri:</strong> {healthData.lifestyle_info || 'Yok'}</Text>
        </Paper>
      )}

      <Group position="right" mt="xl">
        <Button 
          variant="outline" 
          color="gray"
          onClick={() => router.push('/chat')}
        >
          Geri Dön
        </Button>
      </Group>
    </Container>
  );
} 