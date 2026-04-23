'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiPlus, FiSearch } from 'react-icons/fi';
import RecipeCard from '@/components/recipes/RecipeCard';
import Skeleton from '@/components/ui/Skeleton';
import { IRecipe } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

const tags = ['veg','non-veg','quick','spicy','dessert','breakfast','street-food','comfort-food'];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (tag) params.set('tag', tag);
    if (difficulty) params.set('difficulty', difficulty);
    fetch(`/api/recipes?${params}`)
      .then(r => r.json())
      .then(d => setRecipes(d.recipes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedSearch, tag, difficulty]);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-xl font-bold text-text">Recipe Box</h1>
          <p className="text-text-muted text-xs mt-0.5">Your personal recipe collection</p>
        </motion.div>
        <Link href="/dashboard/recipes/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all text-sm">
          <FiPlus size={14} /> Add Recipe
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-text placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none transition-all text-sm" />
        </div>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-bg-card border border-border text-text text-sm focus:border-accent focus:outline-none">
          <option value="">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setTag('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!tag ? 'bg-accent text-white' : 'bg-bg-card border border-border text-text-muted hover:text-text'}`}>
          All
        </button>
        {tags.map(t => (
          <button key={t} onClick={() => setTag(tag === t ? '' : t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tag === t ? 'bg-accent text-white' : 'bg-bg-card border border-border text-text-muted hover:text-text'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-56" />)}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-sm font-semibold text-text">No recipes found</h3>
          <p className="text-text-muted text-xs mt-1">Try different filters or add your first recipe.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recipes.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <RecipeCard recipe={r} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
