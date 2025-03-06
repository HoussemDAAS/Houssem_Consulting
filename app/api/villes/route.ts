import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ville from '@/lib/models/Ville';
// app/api/villes/route.ts
export async function GET() {
  await dbConnect();
  try {
    const villes = await Ville.find().sort({ name: 1 }).lean();
    return NextResponse.json(villes, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch  {
    return NextResponse.json(
      { error: 'Failed to fetch villes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const newVille = new Ville({
      name: body.name.trim()
    });

    await newVille.save();
    return NextResponse.json(newVille, { status: 201 });
  } catch (error) {
    console.error('Creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create ville' },
      { status: 500 }
    );
  }
}