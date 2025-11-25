'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storeAuthData } from '@/lib/auth';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (token && email && name) {
      // Store auth data
      storeAuthData(token, email, decodeURIComponent(name));

      // Redirect to home or dashboard
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      // If missing data, redirect to error
      router.push('/auth/error');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h1 className="text-2xl font-bold mb-2">Authentication Successful!</h1>
        <p className="text-gray-600">Redirecting you now...</p>
      </div>
    </div>
  );
}
