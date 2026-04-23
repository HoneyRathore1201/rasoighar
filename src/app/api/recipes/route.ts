import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const maxTime = parseInt(searchParams.get('maxTime') || '999');

    const query: Record<string, unknown> = {
      $or: [{ userId: session.user.id }, { isPublic: true }],
    };
    if (search) {
      query.$text = { $search: search };
    }
    if (tag) query.tags = tag;
    if (difficulty) query.difficulty = difficulty;
    if (cuisine) query.cuisine = { $regex: cuisine, $options: 'i' };
    if (maxTime < 999) {
      query.$expr = { $lte: [{ $add: ['$cookingTime', '$prepTime'] }, maxTime] };
    }

    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ recipes: JSON.parse(JSON.stringify(recipes)), total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get recipes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const data = await req.json();
    if (!data.title || !data.ingredients?.length || !data.instructions?.length) {
      return NextResponse.json({ error: 'Title, ingredients, and instructions are required' }, { status: 400 });
    }
    const ingredientNames = data.ingredients
      .filter((i: { isOptional: boolean }) => !i.isOptional)
      .map((i: { name: string }) => i.name.toLowerCase().trim());

    const recipe = await Recipe.create({ ...data, userId: session.user.id, ingredientNames });
    return NextResponse.json({ recipe: JSON.parse(JSON.stringify(recipe)) }, { status: 201 });
  } catch (error) {
    console.error('Create recipe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
