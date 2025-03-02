/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const clients = await Client.find()
    .populate({
      path: 'region',
      select: 'name code',
      model: 'Region'
    })
    .populate({
      path: 'products.product',
      model: 'Product',
      select: 'name'
    })
      .lean();
    
    return NextResponse.json(clients, { 
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
    
    if (!body.name || !body.region) {
      return NextResponse.json(
        { error: 'Name and region are required' },
        { status: 400 }
      );
    }

    const transformedProducts = body.products?.map((p: any) => ({
      product: p.product,
      modele: p.modele || '',
      reference: p.reference || '',
      plageMesure: p.plageMesure || '',
      annee: p.annee || '',
      versionLogiciel: p.versionLogiciel || '',
      autreInformation: p.autreInformation || '',
      details: (p.details || [])
        .filter((d: any) => d.name?.trim() && d.value?.trim())
        .map((d: any) => ({
          name: d.name.trim(),
          value: d.value.trim()
        })),
      addedAt: p.addedAt || new Date()
    }));

    const client = new Client({
      name: body.name,
      region: body.region,
      products: transformedProducts
    });

    await client.save();
    return NextResponse.json(
      await Client.populate(client, [
        { path: 'region' },
        { path: 'products.product' }
      ]), 
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}