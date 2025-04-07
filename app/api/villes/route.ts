import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ville from '@/lib/models/Ville';
// import Region from '@/lib/models/Region';

export async function GET() {
  await dbConnect();
  
  try {
    // Basic fetch (original functionality)
    const villes = await Ville.find().sort({ name: 1 }).lean();
    
    // Enhanced version with region data (optional)
    // const villes = await Ville.find()
    //   .sort({ name: 1 })
    //   .populate('region', 'name code -_id') // Only include region name and code
    //   .lean();
    
    return NextResponse.json(villes, {
      headers: { 
        'Cache-Control': 'no-store, max-age=0',
        'CDN-Cache-Control': 'max-age=60' 
      }
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch villes' },
      { status: 500 }
    );
  }
}
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Ville from '@/lib/models/Ville';
// // app/api/villes/route.ts
// export async function GET() {
//   await dbConnect();
//   try {
//     const villes = await Ville.find().sort({ name: 1 }).lean();
//     return NextResponse.json(villes, {
//       headers: { 'Cache-Control': 'no-store, max-age=0' }
//     });
//   } catch  {
//     return NextResponse.json(
//       { error: 'Failed to fetch villes' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   await dbConnect();
//   try {
//     const body = await request.json();
    
//     if (!body.name) {
//       return NextResponse.json(
//         { error: 'Name is required' },
//         { status: 400 }
//       );
//     }

//     const newVille = new Ville({
//       name: body.name.trim()
//     });

//     await newVille.save();
//     return NextResponse.json(newVille, { status: 201 });
//   } catch (error) {
//     console.error('Creation error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create ville' },
//       { status: 500 }
//     );
//   }
// }