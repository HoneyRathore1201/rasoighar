'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiTrash2, FiClock, FiUsers } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { IRecipe } from '@/types';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then(r => r.json()).then(d => setRecipe(d.recipe))
      .catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;
    const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Recipe deleted'); router.push('/dashboard/recipes'); }
    else toast.error('Failed to delete');
  };

  if (loading) return <div className="max-w-3xl mx-auto space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-56 rounded-2xl" /></div>;
  if (!recipe) return <div className="text-center py-16"><p className="text-text-muted text-sm">Recipe not found</p></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/recipes" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors text-sm">
          <FiArrowLeft size={16} /> Back
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon={<FiEdit3 size={14} />} onClick={() => router.push(`/dashboard/recipes/${id}/edit`)}>Edit</Button>
          <Button variant="danger" size="sm" icon={<FiTrash2 size={14} />} onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="h-56 rounded-2xl overflow-hidden mb-5 relative">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-bg-elevated flex items-center justify-center">
              <span className="text-5xl font-bold text-accent/30">{recipe.title.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
        </div>

        <h1 className="text-2xl font-bold text-text">{recipe.title}</h1>
        <p className="text-text-muted mt-1 text-sm">{recipe.description}</p>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1"><FiClock size={12} /> Cook: {formatTime(recipe.cookingTime)}</span>
          <span className="flex items-center gap-1"><FiClock size={12} /> Prep: {formatTime(recipe.prepTime)}</span>
          <span className="flex items-center gap-1"><FiUsers size={12} /> {recipe.servings} servings</span>
          <Badge variant="accent">{recipe.difficulty}</Badge>
          <Badge variant="accent">{recipe.cuisine}</Badge>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {recipe.tags.map(tag => <Badge key={tag} variant={tag === 'veg' ? 'green' : tag === 'non-veg' ? 'chili' : 'gray'}>{tag}</Badge>)}
        </div>
      </motion.div>

      <Card className="p-5">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Ingredients</h2>
        <div className="space-y-1">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-lg ${i % 2 === 0 ? 'bg-bg-elevated' : ''}`}>
              <span className={`text-sm ${ing.isOptional ? 'text-text-muted italic' : 'text-text font-medium'}`}>
                {ing.name} {ing.isOptional && '(optional)'}
              </span>
              <span className="text-xs text-text-muted">{ing.quantity} {ing.unit}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Instructions</h2>
        <div className="space-y-3">
          {recipe.instructions.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent text-white text-[10px] flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</div>
              <p className="text-text-secondary text-sm leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
