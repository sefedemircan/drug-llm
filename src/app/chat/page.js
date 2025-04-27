"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Shell from '../../components/Shell';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Yükleme durumunda veya kullanıcı doğrulanmadıysa içerik göstermeyelim
  if (loading || !user) {
    return <LoadingSpinner fullScreen message="Oturum bilgileriniz kontrol ediliyor" />;
  }

  return <Shell />;
} 