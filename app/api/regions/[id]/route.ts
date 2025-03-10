// app/api/regions/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Region from '@/lib/models/Region';
import Client from '@/lib/models/Client';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } } // Properly get ID from route params
) {
  await dbConnect();
  
  try {
    // Validate ID format
    if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return NextResponse.json(
        { error: 'Invalid region ID format' },
        { status: 400 }
      );
    }

    
    await Client.updateMany(
      { region: params.id },
      { $set: { region: null } }
    );
    const deletedRegion = await Region.findByIdAndDelete(params.id);
    
    if (!deletedRegion) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Region deleted and clients unassigned'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete region' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } } // Properly get ID from route params
) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    const updatedRegion = await Region.findByIdAndUpdate(
      params.id,
      { name: body.name, code: body.code.toUpperCase() },
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