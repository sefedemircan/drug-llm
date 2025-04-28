"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Shell from '../../components/Shell';
import LoadingSpinner from '../../components/LoadingSpinner';
import { LoadingOverlay } from '@mantine/core';

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
    return (
      <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
        <LoadingOverlay 
          visible={true} 
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ size: 'lg', color: 'blue' }}
        />
      </div>
    );
  }

  return <Shell />;
} 