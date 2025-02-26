import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // 1. Connect to database first
    await dbConnect();

    // 2. Verify JWT
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Verify token with proper error handling
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // 4. Fetch clients with safer population
    const clients = await Client.find()
      .populate({
        path: 'products.product',
        model: 'Product',
        select: 'name subProducts'
      })
      .lean();

    return new NextResponse(JSON.stringify(clients), {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error cases
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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