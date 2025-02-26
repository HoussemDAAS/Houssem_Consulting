/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
  await dbConnect();
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    const products = await Product.find().lean();
    return new NextResponse(JSON.stringify(products), {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }  });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const product = new Product(body);
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}