'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GiCookingPot } from 'react-icons/gi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return; }
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.ok) {
        await fetch('/api/seed', { method: 'POST' }).catch(() => {});
        router.push('/dashboard');
      } else { setError('Account created, but auto-login failed. Try logging in.'); setLoading(false); }
    } catch { setError('Something went wrong. Please try again.'); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GiCookingPot className="text-white text-xl" />
          </div>
          <h1 className="text-xl font-bold text-text">Create Account</h1>
          <p className="text-text-muted text-xs mt-1">Start your cooking journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-bg-card border border-border">
          {error && <div className="px-3 py-2 rounded-lg bg-danger/10 text-danger text-xs font-medium">{error}</div>}
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" icon={<FiUser size={15} />} required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" icon={<FiMail size={15} />} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" icon={<FiLock size={15} />} required minLength={6} />
          <Button type="submit" loading={loading} className="w-full">Create Account</Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Already have an account? <Link href="/login" className="text-accent hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
