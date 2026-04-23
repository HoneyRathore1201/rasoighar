'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { IRecipe } from '@/types';

const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const;
const meals = ['breakfast','lunch','dinner','snack'] as const;
const dayLabels: Record<string,string> = { monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu', friday:'Fri', saturday:'Sat', sunday:'Sun' };

type Plan = Record<string, Record<string, string>>;

export default function MealPlannerPage() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [plan, setPlan] = useState<Plan>({});
  const [selectedSlot, setSelectedSlot] = useState<{day:string;meal:string}|null>(null);

  useEffect(() => {
    fetch('/api/recipes?limit=100').then(r=>r.json()).then(d=>setRecipes(d.recipes||[])).catch(console.error);
  }, []);

  const assignRecipe = (recipeId: string) => {
    if (!selectedSlot) return;
    setPlan(prev => ({ ...prev, [selectedSlot.day]: { ...prev[selectedSlot.day], [selectedSlot.meal]: recipeId } }));
    setSelectedSlot(null);
  };

  const getRecipe = (id: string) => recipes.find(r => r._id === id);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}>
        <h1 className="text-xl font-bold text-text">Meal Planner</h1>
        <p className="text-text-muted text-xs mt-0.5">Plan your weekly meals</p>
      </motion.div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div />
            {days.map(d => <div key={d} className="text-center text-xs font-semibold text-text-secondary">{dayLabels[d]}</div>)}
          </div>
          {meals.map(meal => (
            <div key={meal} className="grid grid-cols-8 gap-2 mb-2">
              <div className="flex items-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                {meal}
              </div>
              {days.map(day => {
                const recipeId = plan[day]?.[meal];
                const recipe = recipeId ? getRecipe(recipeId) : null;
                return (
                  <button key={`${day}-${meal}`} onClick={() => setSelectedSlot({ day, meal })}
                    className={`min-h-[56px] rounded-xl border transition-all text-[10px] p-1.5
                      ${selectedSlot?.day===day && selectedSlot?.meal===meal
                        ? 'border-accent bg-accent/10'
                        : recipe ? 'border-success/20 bg-success/5' : 'border-border hover:border-accent/30 hover:bg-bg-hover'
                      }`}
                  >
                    {recipe ? (
                      <span className="text-text font-medium line-clamp-2">{recipe.title}</span>
                    ) : (
                      <span className="text-text-muted">+</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedSlot && (
        <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}>
          <Card className="p-5">
            <h3 className="font-semibold text-text text-sm mb-3">
              Select recipe for {dayLabels[selectedSlot.day]} {selectedSlot.meal}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {recipes.map(r => (
                <button key={r._id} onClick={() => assignRecipe(r._id)}
                  className="text-left p-2.5 rounded-xl hover:bg-bg-hover border border-border transition-colors flex items-center gap-2">
                  {r.image && <img src={r.image} alt={r.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                  <div>
                    <p className="text-xs font-medium text-text line-clamp-1">{r.title}</p>
                    <p className="text-[10px] text-text-muted">{r.cuisine} · {r.cookingTime}min</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedSlot(null)} className="mt-3 text-xs text-text-muted hover:text-text">Cancel</button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
