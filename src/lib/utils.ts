// ============================================
// Utility Functions
// ============================================

import { IRecipe, IMatchResult } from '@/types';

/**
 * Calculate match results between available ingredients and recipes
 */
export function calculateMatches(
  availableIngredients: string[],
  recipes: IRecipe[]
): IMatchResult[] {
  const available = new Set(availableIngredients.map((i) => i.toLowerCase().trim()));

  const results: IMatchResult[] = recipes.map((recipe) => {
    const required = recipe.ingredientNames.map((i) => i.toLowerCase().trim());
    const requiredSet = new Set(required);

    const matched: string[] = [];
    const missing: string[] = [];

    requiredSet.forEach((ingredient) => {
      if (available.has(ingredient)) {
        matched.push(ingredient);
      } else {
        missing.push(ingredient);
      }
    });

    const matchScore = requiredSet.size > 0 ? (matched.length / requiredSet.size) * 100 : 0;

    let category: 'exact' | 'close' | 'partial';
    if (matchScore === 100) category = 'exact';
    else if (matchScore >= 70) category = 'close';
    else category = 'partial';

    return {
      recipe,
      matchScore: Math.round(matchScore),
      matchedIngredients: matched,
      missingIngredients: missing,
      category,
    };
  });

  return results
    .filter((r) => r.matchScore >= 30)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (a.missingIngredients.length !== b.missingIngredients.length)
        return a.missingIngredients.length - b.missingIngredients.length;
      return a.recipe.cookingTime - b.recipe.cookingTime;
    });
}

/**
 * Format cooking time into human-readable string
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-success/15 text-success';
    case 'medium':
      return 'bg-warning/15 text-warning';
    case 'hard':
      return 'bg-danger/15 text-danger';
    default:
      return 'bg-bg-hover text-text-muted';
  }
}

/**
 * Get match category color
 */
export function getMatchColor(category: string): string {
  switch (category) {
    case 'exact':
      return 'text-success';
    case 'close':
      return 'text-accent';
    case 'partial':
      return 'text-warning';
    default:
      return 'text-text-muted';
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    // Remove markdown code fences if present
    const cleaned = json.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}
