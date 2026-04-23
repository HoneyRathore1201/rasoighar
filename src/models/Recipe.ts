// ============================================
// Recipe Model
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
    isOptional: boolean;
  }[];
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
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipeDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String },
        unit: { type: String },
        isOptional: { type: Boolean, default: false },
      },
    ],
    instructions: [{ type: String }],
    tags: [{ type: String }],
    cookingTime: { type: Number, required: true },
    prepTime: { type: Number, default: 0 },
    servings: { type: Number, default: 4 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    cuisine: { type: String, default: 'Indian' },
    image: { type: String },
    isPublic: { type: Boolean, default: true },
    ingredientNames: [{ type: String }],
  },
  { timestamps: true }
);

// Text index for full-text search
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
// Index for ingredient matching
RecipeSchema.index({ ingredientNames: 1 });
// Index for user queries
RecipeSchema.index({ userId: 1 });

// ingredientNames are populated in the API route handlers before save

export default mongoose.models.Recipe || mongoose.model<IRecipeDocument>('Recipe', RecipeSchema);
