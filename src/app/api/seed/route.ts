import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { auth } from '@/lib/auth';
import { sampleRecipes } from '@/data/sampleRecipes';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const existing = await Recipe.countDocuments({ userId: session.user.id });
    if (existing > 0) {
      return NextResponse.json({ message: 'Recipes already seeded', count: existing });
    }
    const recipes = sampleRecipes.map((r) => ({ ...r, userId: session.user!.id }));
    const created = await Recipe.insertMany(recipes);
    return NextResponse.json({ message: 'Seeded successfully', count: created.length }, { status: 201 });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
