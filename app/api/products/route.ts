/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';


export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find().lean();
    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch  {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const product = new Product({
      name: body.name.trim(),
      image: body.image || ''
    });
    
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Similar updates for PUT and DELETE endpoints...