'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GiCookingPot } from 'react-icons/gi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.ok) router.push('/dashboard');
      else setError('Invalid email or password');
    } catch { setError('Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GiCookingPot className="text-white text-xl" />
          </div>
          <h1 className="text-xl font-bold text-text">Welcome back</h1>
          <p className="text-text-muted text-xs mt-1">Sign in to your kitchen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-bg-card border border-border">
          {error && <div className="px-3 py-2 rounded-lg bg-danger/10 text-danger text-xs font-medium">{error}</div>}
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" icon={<FiMail size={15} />} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" icon={<FiLock size={15} />} required />
          <Button type="submit" loading={loading} className="w-full">Sign In</Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Don&apos;t have an account? <Link href="/signup" className="text-accent hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
