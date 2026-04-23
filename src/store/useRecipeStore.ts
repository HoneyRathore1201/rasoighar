// ============================================
// Recipe Store (Zustand)
// ============================================

import { create } from 'zustand';
import { IRecipe, DietaryFilter, DifficultyFilter } from '@/types';

interface RecipeState {
  recipes: IRecipe[];
  loading: boolean;
  searchQuery: string;
  dietaryFilter: DietaryFilter;
  difficultyFilter: DifficultyFilter;
  cuisineFilter: string;
  maxTime: number;
  setRecipes: (recipes: IRecipe[]) => void;
  addRecipe: (recipe: IRecipe) => void;
  updateRecipe: (id: string, recipe: IRecipe) => void;
  removeRecipe: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setDietaryFilter: (filter: DietaryFilter) => void;
  setDifficultyFilter: (filter: DifficultyFilter) => void;
  setCuisineFilter: (filter: string) => void;
  setMaxTime: (time: number) => void;
  filteredRecipes: () => IRecipe[];
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  loading: false,
  searchQuery: '',
  dietaryFilter: 'all',
  difficultyFilter: 'all',
  cuisineFilter: 'all',
  maxTime: 999,

  setRecipes: (recipes) => set({ recipes }),
  addRecipe: (recipe) => set((state) => ({ recipes: [recipe, ...state.recipes] })),
  updateRecipe: (id, recipe) =>
    set((state) => ({
      recipes: state.recipes.map((r) => (r._id === id ? recipe : r)),
    })),
  removeRecipe: (id) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r._id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDietaryFilter: (dietaryFilter) => set({ dietaryFilter }),
  setDifficultyFilter: (difficultyFilter) => set({ difficultyFilter }),
  setCuisineFilter: (cuisineFilter) => set({ cuisineFilter }),
  setMaxTime: (maxTime) => set({ maxTime }),

  filteredRecipes: () => {
    const { recipes, searchQuery, dietaryFilter, difficultyFilter, cuisineFilter, maxTime } = get();
    let filtered = [...recipes];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.ingredientNames.some((i) => i.includes(q))
      );
    }

    if (dietaryFilter !== 'all') {
      filtered = filtered.filter((r) => r.tags.includes(dietaryFilter));
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((r) => r.difficulty === difficultyFilter);
    }

    if (cuisineFilter !== 'all') {
      filtered = filtered.filter((r) => r.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase()));
    }

    if (maxTime < 999) {
      filtered = filtered.filter((r) => r.cookingTime + r.prepTime <= maxTime);
    }

    return filtered;
  },
}));
