import dbConnect from "@/lib/dbConnect";
import Client from "@/lib/models/Client";
import Secteur from "@/lib/models/Secteur";
import { NextResponse } from "next/server";
// app/api/secteurs/[id]/route.ts
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
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