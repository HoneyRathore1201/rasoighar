import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { auth } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const recipe = await Recipe.findById(id).lean();
    if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    return NextResponse.json({ recipe: JSON.parse(JSON.stringify(recipe)) });
  } catch (error) {
    console.error('Get recipe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const ingredientNames = data.ingredients
      ?.filter((i: { isOptional: boolean }) => !i.isOptional)
      .map((i: { name: string }) => i.name.toLowerCase().trim()) || [];
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...data, ingredientNames },
      { new: true }
    ).lean();
    if (!recipe) return NextResponse.json({ error: 'Recipe not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ recipe: JSON.parse(JSON.stringify(recipe)) });
  } catch (error) {
    console.error('Update recipe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const recipe = await Recipe.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!recipe) return NextResponse.json({ error: 'Recipe not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ message: 'Recipe deleted' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
