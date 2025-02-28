/* eslint-disable @typescript-eslint/no-explicit-any */
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
    
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est obligatoire' },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { name: body.name.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Update error:', error);
    
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Cette catégorie existe déjà' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : 'Erreur de mise à jour') },
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
    
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Remove references from clients
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