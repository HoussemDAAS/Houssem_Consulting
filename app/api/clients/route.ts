// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';
import jwt from 'jsonwebtoken';
// app/api/clients/route.ts

export async function GET(request: Request) {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Fetch clients and populate product names
    const clients = await Client.find()
      .populate({
        path: 'products.product', // Path to populate
        model: 'Product', // Model to use for population
        select: 'name', // Only fetch the 'name' field of the product
      })
      .lean();

    // 3. Return the clients with populated product names
    return NextResponse.json(clients, { status: 200 });

  } catch (error) {
    console.error('Error in /api/clients:', error);

    // 4. Handle errors gracefully
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    jwt.verify(token, process.env.JWT_SECRET!);
    const body = await request.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    const client = new Client(body);
    await client.save();
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}