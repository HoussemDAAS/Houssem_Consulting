/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const body = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Deletion failed' },
      { status: 500 }
    );
  }
}