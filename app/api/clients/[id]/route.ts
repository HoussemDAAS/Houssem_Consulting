/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Add proper product transformation
    const transformedProducts = body.products?.map((p: any) => ({
      product: p.product,
      modele: p.modele || '',
      reference: p.reference || '',
      plageMesure: p.plageMesure || '',
      annee: p.annee || '',
      versionLogiciel: p.versionLogiciel || '',
      autreInformation: p.autreInformation || '',
      details: (p.details || []).map((d: any) => ({
        name: d.name?.trim() || '',
        value: d.value?.trim() || ''
      })),
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
  } catch {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}