'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const dietaryOptions = ['veg','non-veg','vegan','eggetarian'] as const;
const spiceOptions = ['mild','medium','spicy','extra-spicy'] as const;
const allergyOptions = ['Peanuts','Tree Nuts','Dairy','Gluten','Shellfish','Soy','Eggs'];
const cuisineOptions = ['North Indian','South Indian','Maharashtrian','Gujarati','Bengali','Rajasthani','Hyderabadi','Punjabi','Kerala','Mughlai'];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [dietary, setDietary] = useState<string>('non-veg');
  const [spice, setSpice] = useState<string>('medium');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);

  const toggleAllergy = (a: string) => setAllergies(p => p.includes(a) ? p.filter(x=>x!==a) : [...p, a]);
  const toggleCuisine = (c: string) => setCuisines(p => p.includes(c) ? p.filter(x=>x!==c) : [...p, c]);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}>
        <h1 className="text-xl font-bold text-text">Settings</h1>
        <p className="text-text-muted text-xs mt-0.5">Customize your cooking preferences</p>
      </motion.div>

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center text-xl text-accent font-bold">
            {session?.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-text">{session?.user?.name}</h2>
            <p className="text-xs text-text-muted">{session?.user?.email}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Dietary Preference</h2>
        <div className="flex flex-wrap gap-1.5">
          {dietaryOptions.map(d => (
            <button key={d} onClick={() => setDietary(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                ${dietary===d ? 'bg-accent text-white' : 'bg-bg-elevated text-text-muted hover:text-text border border-border'}`}>
              {d}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Spice Level</h2>
        <div className="flex flex-wrap gap-1.5">
          {spiceOptions.map(s => (
            <button key={s} onClick={() => setSpice(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                ${spice===s ? 'bg-danger text-white' : 'bg-bg-elevated text-text-muted hover:text-text border border-border'}`}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Allergies</h2>
        <div className="flex flex-wrap gap-1.5">
          {allergyOptions.map(a => (
            <button key={a} onClick={() => toggleAllergy(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${allergies.includes(a) ? 'bg-danger text-white' : 'bg-bg-elevated text-text-muted border border-border hover:text-text'}`}>
              {a}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Preferred Cuisines</h2>
        <div className="flex flex-wrap gap-1.5">
          {cuisineOptions.map(c => (
            <button key={c} onClick={() => toggleCuisine(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${cuisines.includes(c) ? 'bg-success text-white' : 'bg-bg-elevated text-text-muted border border-border hover:text-text'}`}>
              {c}
            </button>
          ))}
        </div>
      </Card>

      <Button onClick={() => toast.success('Preferences saved!')} icon={<FiSave size={15} />} className="w-full">Save Preferences</Button>
    </div>
  );
}
