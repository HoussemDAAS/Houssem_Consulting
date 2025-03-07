// // app/api/upload/route.ts
// import { NextResponse } from 'next/server';
// import { unlink, writeFile } from 'fs/promises';
// import { join } from 'path';
// import { randomUUID } from 'crypto';
// import { existsSync, mkdirSync } from 'fs';

// // export async function POST(request: Request) {
// //   try {
// //     const data = await request.formData();
// //     const file: File | null = data.get('file') as unknown as File;

// //     if (!file) {
// //       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
// //     }

// //     const bytes = await file.arrayBuffer();
// //     const buffer = Buffer.from(bytes);

// //     // Create uploads directory if it doesn't exist
// //     const uploadsDir = join(process.cwd(), 'public/uploads');
// //     try {
// //       await writeFile(join(uploadsDir, 'test.txt'), 'test');
// //     } catch (err) {
// //       console.error('Error writing to uploads directory:', err);
// //       return NextResponse.json(
// //         { error: 'Error accessing uploads directory' },
// //         { status: 500 }
// //       );
// //     }

// //     const filename = `${randomUUID()}-${file.name}`;
// //     const path = join(uploadsDir, filename);

// //     await writeFile(path, buffer);
    
// //     return NextResponse.json({ 
// //       success: true, 
// //       filename: `/uploads/${filename}` 
// //     });
// //   } catch (error) {
// //     console.error('Upload error:', error);
// //     return NextResponse.json(
// //       { error: 'Error saving file' },
// //       { status: 500 }
// //     );
// //   }
// // }
// export async function POST(request: Request) {
//   try {
//     const data = await request.formData();
//     const file = data.get('file') as File;
    
//     if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
//     }

//     // Create uploads directory if needed
//     const uploadsDir = join(process.cwd(), 'public/uploads');
//     if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

//     const filename = `${randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
//     const buffer = Buffer.from(await file.arrayBuffer());
    
//     await writeFile(join(uploadsDir, filename), buffer);
    
//     return NextResponse.json({ 
//       success: true, 
//       filename: `/uploads/${filename}` 
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { error: 'File upload failed' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const filePath = searchParams.get('path');
    
//     if (!filePath) return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
    
//     const fullPath = join(process.cwd(), 'public', filePath);
//     await unlink(fullPath);
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Delete error:', error);
//     return NextResponse.json(
//       { error: 'File deletion failed' },
//       { status: 500 }
//     );
//   }
// }
// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData();
  const file = form.get('file') as File;

  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get('url');

  if (!urlToDelete) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    await fetch(urlToDelete, { method: 'DELETE' });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}