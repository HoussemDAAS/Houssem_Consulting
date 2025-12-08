/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/dbConnect";
import Client from "@/lib/models/Client";
import Secteur from "@/lib/models/Secteur";
import { NextResponse } from "next/server";
import mongoose from 'mongoose'; 
// app/api/secteurs/[id]/route.ts

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await dbConnect();
  
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { error: 'Invalid secteur ID' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: 'Both name and code are required' },
        { status: 400 }
      );
    }

    const updatedSecteur = await Secteur.findByIdAndUpdate(
      params.id,
      {
        name: body.name.trim(),
        code: body.code.toUpperCase().trim()
      },
      { new: true, runValidators: true }
    );

    if (!updatedSecteur) {
      return NextResponse.json(
        { error: 'Secteur not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSecteur);
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update secteur' },
      { status: 500 }
    );
  }
}
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
  ) {
    const params = await props.params;
    await dbConnect();
    
    try {
      // Remove secteur from clients first
      await Client.updateMany(
        { secteur: params.id },
        { $unset: { secteur: "" } }
      );
  
      const deletedSecteur = await Secteur.findByIdAndDelete(params.id);
      
      if (!deletedSecteur) {
        return NextResponse.json(
          { error: 'Secteur not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete secteur' },
        { status: 500 }
      );
    }
  }