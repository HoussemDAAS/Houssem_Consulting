/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';




import mongoose from 'mongoose';


export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await dbConnect();
  
  try {
    const body = await request.json();
    
    // Validate name if being updated
    if (body.name !== undefined) {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { error: 'Client name cannot be empty' },
          { status: 400 }
        );
      }

      // Check for duplicate name
      const existingClient = await Client.findOne({
        name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') },
        _id: { $ne: new mongoose.Types.ObjectId(params.id) }
      });
      
      if (existingClient) {
        console.log(`Duplicate found: '${existingClient.name}' (ID: ${existingClient._id}) conflicts with update for '${body.name.trim()}' (ID: ${params.id})`);
        return NextResponse.json(
          { error: `Another client with this name already exists (ID: ${existingClient._id})` },
          { status: 409 }
        );
      }
    }

    // Build update object dynamically
    const updateData: Record<string, any> = {};
    
    if (body.address !== undefined) {
      updateData.address = body.address.trim();
    }
    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }
    if (body.region !== undefined) {
      updateData.region = body.region;
    }
    if (body.secteur !== undefined) {
      updateData.secteur = body.secteur || null;
    }
    if (body.ville !== undefined) {
      updateData.ville = body.ville || null;
    }
    if (body.contacts !== undefined) {
      updateData.contacts = body.contacts?.map((c: any) => ({
        firstName: c.firstName || '',
        lastName: c.lastName || '',
        position: c.position || '',
        email: c.email || '',
        phone: c.phone || '',
        service: c.service || '',
        _id: c._id || new mongoose.Types.ObjectId()
      }));
    }
    if (body.products !== undefined) {
      updateData.products = body.products?.map((p: any) => ({
        product: p.product,
        fabriquant: p.fabriquant || '',
        modele: p.modele || '',
        status: p.status || 'negotiation',
        reference: p.reference || '',
        plageMesure: p.plageMesure || '',
        annee: p.annee || '',
        versionLogiciel: p.versionLogiciel || '',
        autreInformation: p.autreInformation || '',
        addedAt: p.addedAt || new Date()
      }));
    }

    const updatedClient = await Client.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate('region')
    .populate('secteur')
    .populate('ville')
    .populate('products.product')
    .lean();

    if (!updatedClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedClient);
    
  } catch (error: any) {
    console.error('Update error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Client with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Update failed. Please check your data.' },
      { status: 400 }
    );
  }
}
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    await Client.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}