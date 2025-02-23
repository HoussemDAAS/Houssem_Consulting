/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/lib/models/Client';


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Update client with proper population
    const updatedClient = await Client.findByIdAndUpdate(
      params.id, // Directly access from params
      { $set: { products: body.products } },
      { 
        new: true, 
        runValidators: true,
        populate: {
          path: 'products.product',
          model: 'Product',
          select: 'name subProducts'
        }
      }
    ).lean();

    if (!updatedClient) throw new Error('Client not found');
    
    return NextResponse.json({
      ...updatedClient,
      // Convert Mongoose document to plain object
      products: updatedClient.products.map(p => ({
        product: p.product._id ? p.product : p.product.toString(),
        subProducts: p.subProducts
      }))
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 400 }
    );
  }
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    await Client.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}