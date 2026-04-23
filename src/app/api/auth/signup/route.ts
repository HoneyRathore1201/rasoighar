import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    try {
      await dbConnect();
    } catch {
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please check your MongoDB connection.' },
        { status: 503 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, password: hashed, provider: 'credentials',
      preferences: { dietary: 'non-veg', allergies: [], spiceLevel: 'medium', cuisinePreference: [] },
      fridge: [], favorites: [],
    });
    return NextResponse.json({ message: 'Account created successfully', userId: user._id }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
