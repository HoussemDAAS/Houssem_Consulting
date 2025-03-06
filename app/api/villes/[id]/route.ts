import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ville from '@/lib/models/Ville';
import Client from '@/lib/models/Client';
import mongoose from 'mongoose';
// app/api/villes/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { error: 'Invalid ville ID' },
      { status: 400 }
    );
  }

  try {
    const ville = await Ville.findById(params.id).lean();
    
    if (!ville) {
      return NextResponse.json(
        { error: 'Ville not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(ville);
  } catch  {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { error: 'Invalid ville ID' },
      { status: 400 }
    );
  }

  try {
    await Client.updateMany(
        { ville: params.id },
        { $unset: { ville: "" } }
      );
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const updatedVille = await Ville.findByIdAndUpdate(
      params.id,
      { name: body.name.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedVille) {
      return NextResponse.json(
        { error: 'Ville not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedVille);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update ville' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { error: 'Invalid ville ID' },
      { status: 400 }
    );
  }

  try {
    // Remove ville from clients first
    await Client.updateMany(
      { ville: params.id },
      { $unset: { ville: "" } }
    );

    const deletedVille = await Ville.findByIdAndDelete(params.id);
    
    if (!deletedVille) {
      return NextResponse.json(
        { error: 'Ville not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete ville' },
      { status: 500 }
    );
  }
}