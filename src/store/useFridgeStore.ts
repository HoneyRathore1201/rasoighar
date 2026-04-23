// ============================================
// Fridge Store (Zustand)
// ============================================

import { create } from 'zustand';
import { IFridgeItem } from '@/types';

interface FridgeState {
  items: IFridgeItem[];
  loading: boolean;
  setItems: (items: IFridgeItem[]) => void;
  addItem: (item: IFridgeItem) => void;
  removeItem: (name: string) => void;
  setLoading: (loading: boolean) => void;
  getIngredientNames: () => string[];
}

export const useFridgeStore = create<FridgeState>((set, get) => ({
  items: [],
  loading: false,

  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => {
      const exists = state.items.some(
        (i) => i.name.toLowerCase() === item.name.toLowerCase()
      );
      if (exists) return state;
      return { items: [...state.items, item] };
    }),
  removeItem: (name) =>
    set((state) => ({
      items: state.items.filter(
        (i) => i.name.toLowerCase() !== name.toLowerCase()
      ),
    })),
  setLoading: (loading) => set({ loading }),
  getIngredientNames: () => get().items.map((i) => i.name.toLowerCase()),
}));
