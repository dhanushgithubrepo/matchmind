'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storeAuthData } from '@/lib/auth';

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (token && email && name) {
      storeAuthData(token, email, decodeURIComponent(name));
      const t = setTimeout(() => {
        router.push('/');
      }, 1000);
      return () => clearTimeout(t);
    } else {
      router.push('/auth/error');
    }
  }, [searchParams, router]);

  return (
    <div className="text-center">
      <div className="mb-4 text-4xl">✓</div>
      <h1 className="text-2xl font-bold mb-2">Authentication Successful!</h1>
      <p className="text-gray-600">Redirecting you now...</p>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div className="text-center">Processing authentication...</div>}>
        <AuthSuccessContent />
      </Suspense>
    </div>
  );
}
