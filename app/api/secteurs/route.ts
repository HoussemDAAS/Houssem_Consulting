// app/api/secteurs/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Secteur from '@/lib/models/Secteur';
// app/api/secteurs/route.ts
export async function GET() {
  await dbConnect();
  try {
    const secteurs = await Secteur.find().lean();
    return NextResponse.json(secteurs);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch secteurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    const newSecteur = new Secteur({
      name: body.name,
      code: body.code.toUpperCase()
    });

    await newSecteur.save();
    return NextResponse.json(newSecteur, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}