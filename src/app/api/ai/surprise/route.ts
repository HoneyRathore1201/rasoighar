import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { surpriseRecipe, isGeminiConfigured } from '@/lib/gemini';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isGeminiConfigured()) return NextResponse.json({ error: 'Gemini API not configured' }, { status: 503 });

  try {
    const recipe = await surpriseRecipe();
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Surprise error:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}
