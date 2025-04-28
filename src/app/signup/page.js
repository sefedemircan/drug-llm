"use client";

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@mantine/core';

function SignupContent() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login?tab=signup');
  }, [router]);

  return null;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }}/>}>
      <SignupContent />
    </Suspense>
  );
} 