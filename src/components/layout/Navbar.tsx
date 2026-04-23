'use client';
import { useSession, signOut } from 'next-auth/react';
import { GiCookingPot } from 'react-icons/gi';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useUIStore } from '@/store/useUIStore';

export default function Navbar() {
  const { data: session } = useSession();
  const { toggleMobileMenu } = useUIStore();
  return (
    <nav className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button onClick={toggleMobileMenu} className="lg:hidden p-2 rounded-lg hover:bg-bg-hover text-text-secondary">
          <FiMenu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <GiCookingPot className="text-white text-sm" />
          </div>
          <span className="text-lg font-bold text-text">RasoiGhar</span>
        </div>
      </div>
      {session && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text">{session.user?.name}</p>
            <p className="text-[11px] text-text-muted">{session.user?.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm">
            {session.user?.name?.[0]?.toUpperCase()}
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 rounded-lg hover:bg-bg-hover text-text-muted hover:text-danger transition-colors" title="Logout">
            <FiLogOut size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
