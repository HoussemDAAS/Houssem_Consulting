/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/lib/models/Product';
import Client from '@/lib/models/Client';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    // Handle legacy documents by merging existing data
    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updateData = {
      name: body.name.trim(),
      abbreviation: body.abbreviation || '',
      image: body.image || existingProduct.image || '',
   
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Update error:', error);
    
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Product already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : 'Update failed') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await dbConnect();
    
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    await Client.updateMany(
      { 'products.product': params.id },
      { $pull: { products: { product: params.id } } }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Catégorie supprimée avec succès'
    });

  } catch (error) {
    console.error('Deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Échec de la suppression' },
      { status: 500 }
    );
  }
}