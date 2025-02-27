// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    
    const updatedClient = await Client.findByIdAndUpdate(
      params.id,
      { $push: { products: body.product } },
      { 
        new: true,
        runValidators: true
      }
    ).lean();

    if (!updatedClient) throw new Error('Client not found');
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    await Client.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}