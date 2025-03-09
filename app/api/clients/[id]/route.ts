/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';

// app/api/clients/[id]/route.ts


import mongoose from 'mongoose';

// app/api/clients/[id]/route.ts
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  

  try {
    const body = await request.json();
    
    const updatedClient = await Client.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...body,
          secteur: body.secteur || null,
          status: body.status || '',
          ville: body.ville || null,
          contacts: body.contacts?.map((c: any) => ({
            firstName: c.firstName || '',
            lastName: c.lastName || '',
            position: c.position || '',
            email: c.email || '',
            phone: c.phone || '',
            service: c.service || '',
            _id: c._id || new mongoose.Types.ObjectId()
          })),
          products: body.products?.map((p: any) => ({
            product: p.product,
            fabriquant: p.fabriquant || '',
            modele: p.modele || '',
            reference: p.reference || '',
            plageMesure: p.plageMesure || '',
            annee: p.annee || '',
            versionLogiciel: p.versionLogiciel || '',
            autreInformation: p.autreInformation || '',
            addedAt: p.addedAt || new Date()
          }))
        }
      },
      // { 
      //   new: true,
      //   runValidators: true 
      // }
    )
    .populate('region')
    .populate('secteur')
    .populate('ville')
    .populate('products.product')
    .lean();

    return NextResponse.json(updatedClient);
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Update failed. Please check your data.' },
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