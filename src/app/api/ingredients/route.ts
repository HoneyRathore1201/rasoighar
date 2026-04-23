import { NextRequest, NextResponse } from 'next/server';
import { indianIngredients } from '@/data/indianIngredients';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const category = searchParams.get('category') || '';
  let results = indianIngredients;
  if (q) {
    results = results.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }
  if (category) {
    results = results.filter((i) => i.category === category);
  }
  return NextResponse.json({ ingredients: results.slice(0, 20) });
}
