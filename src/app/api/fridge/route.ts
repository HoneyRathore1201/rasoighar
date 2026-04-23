import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const user = await User.findById(session.user.id).select('fridge').lean();
    return NextResponse.json({ fridge: user?.fridge || [] });
  } catch (error) {
    console.error('Get fridge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { name, quantity, unit } = await req.json();
    if (!name) return NextResponse.json({ error: 'Ingredient name is required' }, { status: 400 });
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const exists = user.fridge.some((i: { name: string }) => i.name.toLowerCase() === name.toLowerCase());
    if (exists) return NextResponse.json({ error: 'Ingredient already in fridge' }, { status: 409 });
    user.fridge.push({ name, quantity, unit, addedAt: new Date() });
    await user.save();
    return NextResponse.json({ fridge: user.fridge }, { status: 201 });
  } catch (error) {
    console.error('Add to fridge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { name } = await req.json();
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { fridge: { name: { $regex: new RegExp(`^${name}$`, 'i') } } },
    });
    const user = await User.findById(session.user.id).select('fridge').lean();
    return NextResponse.json({ fridge: user?.fridge || [] });
  } catch (error) {
    console.error('Remove from fridge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
