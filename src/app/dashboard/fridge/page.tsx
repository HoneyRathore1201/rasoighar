'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import IngredientInput from '@/components/fridge/IngredientInput';
import Skeleton from '@/components/ui/Skeleton';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { indianIngredients } from '@/data/indianIngredients';

interface FridgeItem { name: string; addedAt: string; }

export default function FridgePage() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fridge').then(r => r.json())
      .then(d => setItems(d.fridge || []))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const addItem = async (name: string) => {
    try {
      const res = await fetch('/api/fridge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (res.ok) { const d = await res.json(); setItems(d.fridge); toast.success(`Added ${name}`); }
      else { const d = await res.json(); toast.error(d.error); }
    } catch { toast.error('Failed to add'); }
  };

  const removeItem = async (name: string) => {
    try {
      const res = await fetch('/api/fridge', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (res.ok) { const d = await res.json(); setItems(d.fridge); toast.success(`Removed ${name}`); }
    } catch { toast.error('Failed to remove'); }
  };

  const categories = ['spice','vegetable','dairy','grain','lentil','protein','oil','nut','other'];
  const grouped: Record<string, FridgeItem[]> = {};
  items.forEach(item => {
    const found = indianIngredients.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    const cat = found?.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-text">My Fridge</h1>
        <p className="text-text-muted text-xs mt-0.5">Track your ingredients at home</p>
      </motion.div>

      <Card className="p-5">
        <IngredientInput onAdd={addItem} placeholder="Add ingredient to your fridge..." />
      </Card>

      {items.length > 0 && (
        <Link href="/dashboard/cook"
          className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all text-sm">
          What Can I Cook? ({items.length} ingredients) <FiArrowRight size={14} />
        </Link>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-text-muted text-sm">Your fridge is empty. Start adding ingredients.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {categories.filter(c => grouped[c]?.length).map(cat => (
            <Card key={cat} className="p-4">
              <h3 className="font-semibold text-text text-xs uppercase tracking-wider flex items-center gap-2 mb-3">
                {cat} <span className="text-text-muted font-normal">({grouped[cat].length})</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {grouped[cat].map(item => (
                    <motion.span key={item.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/8 rounded-full text-xs font-medium text-text">
                      {item.name}
                      <button onClick={() => removeItem(item.name)} className="text-text-muted hover:text-danger transition-colors">
                        <FiX size={10} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
