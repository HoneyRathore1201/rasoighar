// ============================================
// RasoiGhar — TypeScript Type Definitions
// ============================================

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: 'credentials' | 'google';
  preferences: IUserPreferences;
  fridge: IFridgeItem[];
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserPreferences {
  dietary: 'veg' | 'non-veg' | 'vegan' | 'eggetarian';
  allergies: string[];
  spiceLevel: 'mild' | 'medium' | 'spicy' | 'extra-spicy';
  cuisinePreference: string[];
}

export interface IFridgeItem {
  ingredientId?: string;
  name: string;
  quantity?: number;
  unit?: string;
  addedAt: string;
}

export interface IRecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  isOptional: boolean;
}

export interface IRecipe {
  _id: string;
  userId: string;
  title: string;
  description: string;
  ingredients: IRecipeIngredient[];
  instructions: string[];
  tags: string[];
  cookingTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  image?: string;
  isPublic: boolean;
  ingredientNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IIngredient {
  _id: string;
  name: string;
  aliases: string[];
  category: string;
  isVeg: boolean;
  substitutes: string[];
  icon?: string;
}

export interface IMealPlan {
  _id: string;
  userId: string;
  weekStart: string;
  meals: IMealDay[];
  createdAt: string;
}

export interface IMealDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snack?: string;
}

export interface IMatchResult {
  recipe: IRecipe;
  matchScore: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  category: 'exact' | 'close' | 'partial';
}

export interface IRecipeFormData {
  title: string;
  description: string;
  ingredients: IRecipeIngredient[];
  instructions: string[];
  tags: string[];
  cookingTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  image?: string;
  isPublic: boolean;
}

export interface IAiRecipe {
  title: string;
  description: string;
  ingredients: IRecipeIngredient[];
  instructions: string[];
  cookingTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
}

export type SortOption = 'best-match' | 'quickest' | 'least-missing';
export type DietaryFilter = 'all' | 'veg' | 'non-veg' | 'vegan' | 'eggetarian';
export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
