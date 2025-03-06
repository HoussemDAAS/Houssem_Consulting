import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Region from '@/lib/models/Region';
import Client from '@/lib/models/Client';

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

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const { _id, ...updateData } = await request.json();
    
    if (!_id || !updateData.name || !updateData.code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedRegion = await Region.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRegion) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRegion);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update region' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { id } = await request.json();
    
    // Check if any clients are using this region
    const clientCount = await Client.countDocuments({ region: id });
    if (clientCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete region with assigned clients' },
        { status: 400 }
      );
    }

    const deletedRegion = await Region.findByIdAndDelete(id);
    
    if (!deletedRegion) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete region' },
      { status: 500 }
    );
  }
}