import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Region from '@/lib/models/Region';

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
    
    // Validate required fields
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    // Check for existing region
    const existingRegion = await Region.findOne({
      $or: [
        { name: body.name },
        { code: body.code.toUpperCase() }
      ]
    });

    if (existingRegion) {
      return NextResponse.json(
        { error: 'Region with this name or code already exists' },
        { status: 409 }
      );
    }

    const newRegion = new Region({
      name: body.name,
      code: body.code.toUpperCase()
    });

    await newRegion.save();
    return NextResponse.json(newRegion, { status: 201 });

  } catch (error) {
    console.error('Region creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}