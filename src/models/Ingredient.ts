// ============================================
// Ingredient Model (Master List)
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredientDocument extends Document {
  name: string;
  aliases: string[];
  category: string;
  isVeg: boolean;
  substitutes: string[];
  icon?: string;
}

const IngredientSchema = new Schema<IIngredientDocument>({
  name: { type: String, required: true, unique: true },
  aliases: [{ type: String }],
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  substitutes: [{ type: String }],
  icon: { type: String },
});

IngredientSchema.index({ name: 1 });
IngredientSchema.index({ aliases: 1 });
IngredientSchema.index({ category: 1 });

export default mongoose.models.Ingredient || mongoose.model<IIngredientDocument>('Ingredient', IngredientSchema);
