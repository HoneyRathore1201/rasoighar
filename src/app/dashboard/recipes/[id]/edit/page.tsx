'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import IngredientInput from '@/components/fridge/IngredientInput';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { IRecipe } from '@/types';

const tagOptions = ['veg','non-veg','vegan','quick','spicy','mild','breakfast','lunch','dinner','snack','dessert','street-food','comfort-food','festive','healthy'];
const cuisineOptions = ['North Indian','South Indian','Maharashtrian','Gujarati','Bengali','Rajasthani','Hyderabadi','Punjabi','Kerala','Mughlai'];

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<{name:string;quantity:string;unit:string;isOptional:boolean}[]>([]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState(30);
  const [prepTime, setPrepTime] = useState(15);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium');
  const [cuisine, setCuisine] = useState('North Indian');

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then(r => r.json()).then(d => {
        const r: IRecipe = d.recipe;
        if (r) { setTitle(r.title); setDescription(r.description); setIngredients(r.ingredients);
          setInstructions(r.instructions); setTags(r.tags); setCookingTime(r.cookingTime);
          setPrepTime(r.prepTime); setServings(r.servings); setDifficulty(r.difficulty); setCuisine(r.cuisine); }
      }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !ingredients.length) { toast.error('Title and ingredients required'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, ingredients, instructions: instructions.filter(s=>s.trim()),
          tags, cookingTime, prepTime, servings, difficulty, cuisine, isPublic: true }),
      });
      if (res.ok) { toast.success('Recipe updated!'); router.push(`/dashboard/recipes/${id}`); }
      else { const d = await res.json(); toast.error(d.error); }
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="max-w-3xl mx-auto space-y-4"><Skeleton className="h-8 w-48"/><Skeleton className="h-96 rounded-2xl"/></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/recipes/${id}`} className="p-2 rounded-lg hover:bg-bg-hover text-text-muted"><FiArrowLeft size={18}/></Link>
        <h1 className="text-xl font-bold text-text">Edit Recipe</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-5 space-y-3">
          <Input label="Recipe Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-elevated border border-border text-text focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none resize-none text-sm"/>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input label="Cook Time" type="number" value={cookingTime} onChange={e=>setCookingTime(+e.target.value)}/>
            <Input label="Prep Time" type="number" value={prepTime} onChange={e=>setPrepTime(+e.target.value)}/>
            <Input label="Servings" type="number" value={servings} onChange={e=>setServings(+e.target.value)}/>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Difficulty</label>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value as 'easy'|'medium'|'hard')}
                className="w-full px-3 py-2.5 rounded-xl bg-bg-elevated border border-border text-text focus:border-accent focus:outline-none text-sm">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Cuisine</label>
            <select value={cuisine} onChange={e=>setCuisine(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-bg-elevated border border-border text-text focus:border-accent focus:outline-none text-sm">
              {cuisineOptions.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Ingredients</h2>
          <IngredientInput onAdd={(n)=>setIngredients(p=>[...p,{name:n,quantity:'',unit:'',isOptional:false}])} />
          <div className="space-y-1.5">
            {ingredients.map((ing,i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-bg-elevated rounded-xl">
                <span className="font-medium text-text flex-shrink-0 w-28 truncate text-xs">{ing.name}</span>
                <input value={ing.quantity} onChange={e=>setIngredients(p=>p.map((x,j)=>j===i?{...x,quantity:e.target.value}:x))} placeholder="Qty"
                  className="w-14 px-2 py-1 rounded-lg bg-bg-card border border-border text-text text-xs"/>
                <input value={ing.unit} onChange={e=>setIngredients(p=>p.map((x,j)=>j===i?{...x,unit:e.target.value}:x))} placeholder="Unit"
                  className="w-16 px-2 py-1 rounded-lg bg-bg-card border border-border text-text text-xs"/>
                <button type="button" onClick={()=>setIngredients(p=>p.filter((_,j)=>j!==i))} className="p-1 text-danger/50 hover:text-danger"><FiTrash2 size={13}/></button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Instructions</h2>
          {instructions.map((step,i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-1 font-bold">{i+1}</span>
              <textarea value={step} onChange={e=>setInstructions(p=>p.map((s,j)=>j===i?e.target.value:s))} rows={2}
                className="flex-1 px-3 py-2 rounded-xl bg-bg-elevated border border-border text-text text-sm resize-none"/>
              {instructions.length>1 && <button type="button" onClick={()=>setInstructions(p=>p.filter((_,j)=>j!==i))} className="p-1 text-danger/50 hover:text-danger mt-1"><FiTrash2 size={13}/></button>}
            </div>
          ))}
          <button type="button" onClick={()=>setInstructions(p=>[...p,''])} className="flex items-center gap-1.5 text-accent text-xs font-medium hover:underline"><FiPlus size={13}/>Add Step</button>
        </Card>

        <Card className="p-5 space-y-3">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Tags</h2>
          <div className="flex flex-wrap gap-1.5">
            {tagOptions.map(t => (
              <button key={t} type="button" onClick={()=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${tags.includes(t)?'bg-accent text-white':'bg-bg-elevated text-text-muted border border-border'}`}>
                {t}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex gap-2 justify-end">
          <Link href={`/dashboard/recipes/${id}`}><Button variant="ghost" type="button">Cancel</Button></Link>
          <Button type="submit" loading={saving} icon={<FiSave size={15}/>}>Update Recipe</Button>
        </div>
      </form>
    </div>
  );
}
