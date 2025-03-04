/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';

// app/api/clients/[id]/route.ts
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    
    const transformedProducts = body.products?.map((p: any) => ({
      product: p.product,
      fabriquant: p.fabriquant || '', // Keep this
      modele: p.modele || '',
      reference: p.reference || '',
      plageMesure: p.plageMesure || '',
      annee: p.annee || '',
      versionLogiciel: p.versionLogiciel || '',
      autreInformation: p.autreInformation || '',
      // Remove the details field completely
      addedAt: p.addedAt || new Date()
    }));

    const updatedClient = await Client.findByIdAndUpdate(
      params.id,
      { 
        $set: {
          ...body,
          products: transformedProducts 
        }
      },
      { 
        new: true,
        runValidators: true
      }
    ).populate('region products.product');

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
  } catch {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}