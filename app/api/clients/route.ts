/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';
import Ville from '@/lib/models/Ville';
import Secteur from '@/lib/models/Secteur';
import Region from '@/lib/models/Region';

// app/api/clients/route.ts
export async function GET(request: Request) {
  void Ville;
  void Secteur;
  try {
    await dbConnect();
    const clients = await Client.find().
    populate({
      path: 'region',
      select: 'name code',
      model: Region // Use imported model directly
    })
    .populate({
      path: 'secteur',
      select: 'name code',
      model: Secteur
    })
    .populate({
      path: 'ville',
      select: 'name',
      model: Ville
    })
    .populate({
      path: 'products.product',
      model: 'Product',
      select: 'name _id'
    })
    .lean();


    const safeClients = clients.map(client => ({
      ...client,
      ville: client.ville || null,
      products: client.products.map(product => ({
        ...product,
        status: product.status || 'negotiation' 
      }))
    }));
    
    return NextResponse.json(safeClients, { 
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Validate name
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      );
    }

    // Check for existing client
    const existingClient = await Client.findOne({ 
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') }
    });
    
    if (existingClient) {
      return NextResponse.json(
        { error: 'Client with this name already exists' },
        { status: 409 }
      );
    }

    // Transform products
    const transformedProducts = body.products?.map((p: any) => ({
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

    // Create new client
    const client = new Client({
      name: body.name.trim(),
      region: body.region,
      ville: body.ville || null,
      secteur: body.secteur || null,
      contacts: body.contacts || [],
      products: transformedProducts || []
    });
    
    await client.save();

    // Populate and return
    return NextResponse.json(
      await Client.populate(client, [
        { path: 'region' },
        { path: 'ville' },
        { path: 'secteur' },
        { path: 'products.product' }
      ]), 
      { status: 201 }
    );
  } catch (error: any) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Client with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}