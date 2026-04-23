import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateRecipe, isGeminiConfigured } from '@/lib/gemini';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isGeminiConfigured()) return NextResponse.json({ error: 'Gemini API not configured' }, { status: 503 });

  try {
    const { ingredients } = await req.json();
    if (!ingredients?.length) return NextResponse.json({ error: 'Ingredients required' }, { status: 400 });
    const recipe = await generateRecipe(ingredients);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}
