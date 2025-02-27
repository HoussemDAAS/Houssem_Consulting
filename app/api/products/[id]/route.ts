/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';
import Client from '@/lib/models/Client';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const existingProduct = await Product.findById(params.id).lean();
    
    // Update the product first
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Find removed subproducts
    const oldSubProducts = existingProduct.subProducts.map((sp: any) => sp.name);
    const newSubProducts = body.subProducts.map((sp: any) => sp.name);
    const removedSubs = oldSubProducts.filter((name: string) => !newSubProducts.includes(name));

    // Remove references from clients
    if (removedSubs.length > 0) {
      await Client.updateMany(
        { 'products.product': params.id },
        { $pull: { 'products.$[elem].subProducts': { $in: removedSubs } } },
        { arrayFilters: [{ 'elem.product': params.id }] }
      );
    }

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // First delete the product
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Then remove references from all clients
    await Client.updateMany(
      { 'products.product': params.id },
      { $pull: { products: { product: params.id } } }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Product deleted and client references removed'
    });

  } catch (error) {
    console.error('Deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Deletion failed' },
      { status: 500 }
    );
  }
}