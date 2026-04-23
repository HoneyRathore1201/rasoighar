'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiShuffle, FiSave } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import IngredientInput from '@/components/fridge/IngredientInput';
import { IAiRecipe } from '@/types';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function RecipeGeneratorPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<IAiRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const generate = async () => {
    if (ingredients.length === 0) { toast.error('Add at least one ingredient'); return; }
    setLoading(true); setRecipe(null);
    try {
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingredients }) });
      const data = await res.json();
      if (res.ok) { setRecipe(data.recipe); toast.success('Recipe generated!'); }
      else toast.error(data.error);
    } catch { toast.error('Generation failed'); }
    finally { setLoading(false); }
  };

  const surprise = async () => {
    setSurpriseLoading(true); setRecipe(null);
    try {
      const res = await fetch('/api/ai/surprise');
      const data = await res.json();
      if (res.ok) { setRecipe(data.recipe); toast.success('Here\'s something new!'); }
      else toast.error(data.error);
    } catch { toast.error('Failed to generate'); }
    finally { setSurpriseLoading(false); }
  };

  const saveRecipe = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      const res = await fetch('/api/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...recipe, isPublic: true }) });
      if (res.ok) toast.success('Saved to your recipe box!');
      else toast.error('Failed to save');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-text">Recipe Generator</h1>
        <p className="text-text-muted text-xs mt-0.5">Create recipes from your ingredients</p>
      </motion.div>

      <Card className="p-5 space-y-3">
        <IngredientInput onAdd={(n) => !ingredients.includes(n) && setIngredients(p => [...p, n])} />
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ingredients.map(i => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-full text-xs font-medium text-text">
                {i} <button onClick={() => setIngredients(p => p.filter(x => x !== i))} className="hover:text-danger">×</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={generate} loading={loading} icon={<FiZap size={15} />}>Generate</Button>
          <Button variant="outline" onClick={surprise} loading={surpriseLoading} icon={<FiShuffle size={15} />}>Surprise Me</Button>
        </div>
      </Card>

      {(loading || surpriseLoading) && (
        <Card className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted mt-3 text-xs">Generating your recipe...</p>
        </Card>
      )}

      {recipe && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5 space-y-4 gradient-border">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="accent" size="md">Generated</Badge>
                <h2 className="text-lg font-bold text-text mt-2">{recipe.title}</h2>
                <p className="text-text-muted mt-1 text-xs">{recipe.description}</p>
                <div className="flex gap-2 mt-2 text-[10px] text-text-muted">
                  <span>{formatTime(recipe.cookingTime)}</span>
                  <span>{recipe.servings} servings</span>
                  <span className="capitalize">{recipe.difficulty}</span>
                  <span>{recipe.cuisine}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={saveRecipe} loading={saving} icon={<FiSave size={13} />}>Save</Button>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Ingredients</h3>
              <div className="space-y-1">
                {recipe.ingredients?.map((ing, i) => (
                  <div key={i} className="flex justify-between py-1.5 px-3 rounded-lg bg-bg-elevated text-xs">
                    <span className="font-medium text-text">{ing.name}</span>
                    <span className="text-text-muted">{ing.quantity} {ing.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Instructions</h3>
              <div className="space-y-2">
                {recipe.instructions?.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] flex items-center justify-center flex-shrink-0 font-bold">{i+1}</span>
                    <p className="text-text-secondary text-xs">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
