import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
  await dbConnect();
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    const products = await Product.find().select('name createdAt').lean();
    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est obligatoire' },
        { status: 400 }
      );
    }

    // Check for existing category
    const existingProduct = await Product.findOne({ name: body.name.trim() });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Cette catégorie existe déjà' },
        { status: 409 }
      );
    }

    const product = new Product({ name: body.name.trim() });
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur du serveur' },
      { status: 500 }
    );
  }
}