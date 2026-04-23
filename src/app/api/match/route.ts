import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { auth } from '@/lib/auth';
import { calculateMatches } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { ingredients, sort = 'best-match' } = await req.json();
    if (!ingredients?.length) {
      return NextResponse.json({ error: 'Provide at least one ingredient' }, { status: 400 });
    }
    const recipes = await Recipe.find({
      $or: [{ userId: session.user.id }, { isPublic: true }],
    }).lean();
    const serialized = JSON.parse(JSON.stringify(recipes));
    let results = calculateMatches(ingredients, serialized);
    if (sort === 'quickest') {
      results.sort((a, b) => a.recipe.cookingTime - b.recipe.cookingTime);
    } else if (sort === 'least-missing') {
      results.sort((a, b) => a.missingIngredients.length - b.missingIngredients.length);
    }
    return NextResponse.json({
      results,
      total: results.length,
      exact: results.filter((r) => r.category === 'exact').length,
      close: results.filter((r) => r.category === 'close').length,
      partial: results.filter((r) => r.category === 'partial').length,
    });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
