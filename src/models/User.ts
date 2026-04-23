// ============================================
// User Model
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: 'credentials' | 'google';
  preferences: {
    dietary: 'veg' | 'non-veg' | 'vegan' | 'eggetarian';
    allergies: string[];
    spiceLevel: 'mild' | 'medium' | 'spicy' | 'extra-spicy';
    cuisinePreference: string[];
  };
  fridge: {
    name: string;
    quantity?: number;
    unit?: string;
    addedAt: Date;
  }[];
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    provider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
    preferences: {
      dietary: { type: String, enum: ['veg', 'non-veg', 'vegan', 'eggetarian'], default: 'non-veg' },
      allergies: [{ type: String }],
      spiceLevel: { type: String, enum: ['mild', 'medium', 'spicy', 'extra-spicy'], default: 'medium' },
      cuisinePreference: [{ type: String }],
    },
    fridge: [
      {
        name: { type: String, required: true },
        quantity: { type: Number },
        unit: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
