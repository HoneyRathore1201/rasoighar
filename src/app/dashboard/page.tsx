'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiBook, FiBox, FiSearch, FiZap, FiCalendar, FiPlus, FiArrowRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import RecipeCard from '@/components/recipes/RecipeCard';
import Skeleton from '@/components/ui/Skeleton';
import { IRecipe } from '@/types';

const quickActions = [
  { href: '/dashboard/recipes/new', label: 'New Recipe', icon: FiPlus, color: 'text-accent bg-accent/10' },
  { href: '/dashboard/cook', label: 'Find Recipes', icon: FiSearch, color: 'text-success bg-success/10' },
  { href: '/dashboard/fridge', label: 'My Fridge', icon: FiBox, color: 'text-warning bg-warning/10' },
  { href: '/dashboard/meal-planner', label: 'Meal Plan', icon: FiCalendar, color: 'text-blue-400 bg-blue-400/10' },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [fridge, setFridge] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/recipes?limit=6').then(r => r.json()).then(d => setRecipes(d.recipes || [])),
      fetch('/api/fridge').then(r => r.json()).then(d => setFridge(d.fridge || [])),
    ]).catch(console.error).finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] || 'Chef';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl lg:text-2xl font-bold text-text">Welcome back, {firstName}</h1>
        <p className="text-text-muted text-xs mt-0.5">Here&apos;s what&apos;s happening in your kitchen.</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <FiBook className="text-accent" size={18} />
          </div>
          <div>
            <p className="text-xl font-bold text-text">{recipes.length > 0 ? '15' : '0'}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Recipes</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <FiBox className="text-success" size={18} />
          </div>
          <div>
            <p className="text-xl font-bold text-text">{fridge.length}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Fridge Items</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
            <FiZap className="text-warning" size={18} />
          </div>
          <div>
            <p className="text-xl font-bold text-text">6</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Gemini Keys</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {quickActions.map(a => (
          <Link key={a.href} href={a.href}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-bg-card border border-border hover:border-accent/20 hover:bg-bg-elevated transition-all text-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.color}`}>
              <a.icon size={15} />
            </div>
            <span className="font-medium text-text text-xs">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Recipes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Recent Recipes</h2>
          <Link href="/dashboard/recipes" className="flex items-center gap-1 text-xs text-accent hover:underline font-medium">
            View All <FiArrowRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-56" />)}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recipes.map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <RecipeCard recipe={r} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-10 text-center">
            <p className="text-text-muted text-sm">No recipes yet. Add your first recipe!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
