import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const clients = await Client.find().lean();
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
    
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    const client = new Client({
      ...body,
      status: body.status || 'active',
      products: body.products || []
    });
    
    await client.save();
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}