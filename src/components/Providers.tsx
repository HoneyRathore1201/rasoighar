'use client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#fff', color: '#8B4513', borderRadius: '12px', border: '1px solid rgba(255,153,51,0.2)', fontFamily: 'Inter, sans-serif' },
        success: { iconTheme: { primary: '#2D6A4F', secondary: '#fff' } },
        error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
      }} />
    </SessionProvider>
  );
}
