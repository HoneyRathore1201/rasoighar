'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMic, FiBox } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import IngredientInput from '@/components/fridge/IngredientInput';
import Skeleton from '@/components/ui/Skeleton';
import { IMatchResult, SortOption } from '@/types';
import { formatTime } from '@/lib/utils';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CookPage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<IMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState<SortOption>('best-match');
  const [stats, setStats] = useState({ exact: 0, close: 0, partial: 0 });
  const voice = useVoiceInput();

  useEffect(() => {
    if (voice.transcript) {
      const parsed = voice.transcript.split(/,|and|&/).map(s => s.trim()).filter(Boolean);
      parsed.forEach(p => { if (!ingredients.includes(p)) setIngredients(prev => [...prev, p]); });
      voice.resetTranscript();
      toast.success(`Added: ${parsed.join(', ')}`);
    }
  }, [voice.transcript]);

  const loadFridge = async () => {
    try {
      const res = await fetch('/api/fridge');
      const data = await res.json();
      const names = (data.fridge || []).map((i: { name: string }) => i.name);
      setIngredients(names);
      if (names.length) toast.success(`Loaded ${names.length} fridge items`);
      else toast.error('Your fridge is empty');
    } catch { toast.error('Failed to load fridge'); }
  };

  const findMatches = async () => {
    if (ingredients.length === 0) { toast.error('Add at least one ingredient'); return; }
    setLoading(true); setSearched(true);
    try {
      const res = await fetch('/api/match', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, sort }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setStats({ exact: data.exact || 0, close: data.close || 0, partial: data.partial || 0 });
    } catch { toast.error('Failed to search'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-text">What Can I Cook?</h1>
        <p className="text-text-muted text-xs mt-0.5">Enter ingredients you have and find matching recipes</p>
      </motion.div>

      <Card className="p-5 space-y-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadFridge} icon={<FiBox size={14} />}>Use My Fridge</Button>
          {voice.isSupported && (
            <Button variant={voice.isListening ? 'danger' : 'ghost'} size="sm"
              onClick={voice.isListening ? voice.stopListening : voice.startListening} icon={<FiMic size={14} />}>
              {voice.isListening ? 'Listening...' : 'Voice'}
            </Button>
          )}
        </div>
        <IngredientInput onAdd={(n) => !ingredients.includes(n) && setIngredients(p => [...p, n])} placeholder="Type ingredients..." />
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ingredients.map(ing => (
              <span key={ing} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                {ing}
                <button onClick={() => setIngredients(p => p.filter(x => x !== ing))} className="hover:text-danger">×</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-center">
          <Button onClick={findMatches} loading={loading} icon={<FiSearch size={15} />}>Find Recipes</Button>
          <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
            className="px-3 py-2 rounded-xl bg-bg-elevated border border-border text-text text-sm focus:outline-none">
            <option value="best-match">Best Match</option>
            <option value="quickest">Quickest</option>
            <option value="least-missing">Least Missing</option>
          </select>
        </div>
      </Card>

      {searched && !loading && (
        <div className="flex gap-2">
          <Badge variant="green" size="md">Exact: {stats.exact}</Badge>
          <Badge variant="accent" size="md">Close: {stats.close}</Badge>
          <Badge variant="gray" size="md">Partial: {stats.partial}</Badge>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.map((r, i) => (
            <motion.div key={r.recipe._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card hover onClick={() => router.push(`/dashboard/recipes/${r.recipe._id}`)} className="p-4">
                <div className="flex items-center gap-4">
                  {r.recipe.image && (
                    <img src={r.recipe.image} alt={r.recipe.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text text-sm">{r.recipe.title}</h3>
                      <span className={`text-xs font-bold ${r.category === 'exact' ? 'text-success' : r.category === 'close' ? 'text-accent' : 'text-text-muted'}`}>
                        {r.matchScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                      <span>{formatTime(r.recipe.cookingTime)}</span>
                      <span>{r.recipe.difficulty}</span>
                    </div>
                    <div className="mt-2 bg-bg-elevated rounded-full h-1.5 w-full max-w-xs">
                      <div className="match-bar h-full" style={{ width: `${r.matchScore}%` }} />
                    </div>
                    {r.missingIngredients.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        <span className="text-[10px] text-text-muted">Missing:</span>
                        {r.missingIngredients.map(m => <span key={m} className="text-[10px] px-1.5 py-0.5 bg-danger/10 text-danger rounded-full">{m}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : searched ? (
        <Card className="p-10 text-center">
          <p className="text-text-muted text-sm">No matching recipes found. Try adding more ingredients.</p>
        </Card>
      ) : null}
    </div>
  );
}
