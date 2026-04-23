'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiBook, FiBox, FiSearch, FiCalendar, FiUser, FiX, FiZap } from 'react-icons/fi';
import { useUIStore } from '@/store/useUIStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/dashboard/recipes', label: 'Recipe Box', icon: FiBook },
  { href: '/dashboard/fridge', label: 'My Fridge', icon: FiBox },
  { href: '/dashboard/cook', label: 'What Can I Cook?', icon: FiSearch },
  { href: '/dashboard/ai', label: 'Recipe Generator', icon: FiZap },
  { href: '/dashboard/meal-planner', label: 'Meal Planner', icon: FiCalendar },
  { href: '/dashboard/profile', label: 'Settings', icon: FiUser },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileMenuOpen, closeMobileMenu } = useUIStore();

  const NavContent = () => (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text hover:bg-bg-hover'
              }`}
          >
            <item.icon size={17} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-bg-card h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <NavContent />
      </aside>
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={closeMobileMenu} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 bg-bg-card border-r border-border shadow-2xl z-50 lg:hidden"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <span className="text-base font-bold text-text">Menu</span>
                <button onClick={closeMobileMenu} className="p-2 rounded-lg hover:bg-bg-hover">
                  <FiX size={18} className="text-text-secondary" />
                </button>
              </div>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
