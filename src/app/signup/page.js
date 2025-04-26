"use client";

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function SignupContent() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login?tab=signup');
  }, [router]);

  return null;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Yönlendiriliyor...</div>}>
      <SignupContent />
    </Suspense>
  );
} 