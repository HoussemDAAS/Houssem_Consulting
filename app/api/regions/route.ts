import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Region from '@/lib/models/Region';

// app/api/regions/route.ts


export async function GET() {
  await dbConnect();
  try {
    const regions = await Region.find().lean();
    return NextResponse.json(regions);
  } catch  {
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
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

    const newRegion = new Region({
      name: body.name,
      code: body.code.toUpperCase()
    });

    await newRegion.save();
    return NextResponse.json(newRegion, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

