'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-4 text-4xl">✗</div>
        <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
        <p className="text-gray-600 mb-6">
          There was an error during the authentication process. Please try again.
        </p>
        <Button onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}
