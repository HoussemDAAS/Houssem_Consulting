// app/api/products/[id]/clients/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
 
    if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const count = await Client.countDocuments({
      'products.product': params.id
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching client count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client count' },
      { status: 500 }
    );
  }
}