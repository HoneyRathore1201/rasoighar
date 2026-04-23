// ============================================
// MealPlan Model
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

export interface IMealPlanDocument extends Document {
  userId: mongoose.Types.ObjectId;
  weekStart: Date;
  meals: {
    day: string;
    breakfast?: mongoose.Types.ObjectId;
    lunch?: mongoose.Types.ObjectId;
    dinner?: mongoose.Types.ObjectId;
    snack?: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
}

const MealPlanSchema = new Schema<IMealPlanDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    meals: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          required: true,
        },
        breakfast: { type: Schema.Types.ObjectId, ref: 'Recipe' },
        lunch: { type: Schema.Types.ObjectId, ref: 'Recipe' },
        dinner: { type: Schema.Types.ObjectId, ref: 'Recipe' },
        snack: { type: Schema.Types.ObjectId, ref: 'Recipe' },
      },
    ],
  },
  { timestamps: true }
);

MealPlanSchema.index({ userId: 1, weekStart: 1 });

export default mongoose.models.MealPlan || mongoose.model<IMealPlanDocument>('MealPlan', MealPlanSchema);
