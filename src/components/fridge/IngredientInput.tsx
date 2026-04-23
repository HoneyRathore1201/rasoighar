'use client';
import { useState, useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import { indianIngredients } from '@/data/indianIngredients';

export default function IngredientInput({ onAdd, placeholder }: { onAdd: (name: string) => void; placeholder?: string }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (val: string) => {
    setValue(val);
    if (val.length > 0) {
      const filtered = indianIngredients
        .filter(i => i.name.toLowerCase().includes(val.toLowerCase()) || i.aliases?.some(a => a.toLowerCase().includes(val.toLowerCase())))
        .map(i => i.name).slice(0, 6);
      setSuggestions(filtered);
    } else setSuggestions([]);
  };

  const addIngredient = (name: string) => {
    onAdd(name);
    setValue('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) { e.preventDefault(); addIngredient(value.trim()); }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input ref={inputRef} value={value} onChange={e => handleChange(e.target.value)} onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type an ingredient...'}
          className="flex-1 px-4 py-2.5 rounded-xl bg-bg-elevated border border-border text-text placeholder:text-text-muted
            focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none transition-all text-sm" />
        <button onClick={() => value.trim() && addIngredient(value.trim())}
          className="px-3 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors">
          <FiPlus size={16} />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
          {suggestions.map(s => (
            <button key={s} onClick={() => addIngredient(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-text hover:bg-bg-hover transition-colors border-b border-border last:border-b-0">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
