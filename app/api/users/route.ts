// app/api/users/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    console.log('Received token:', token); // Debug
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      userId: string, 
      role: string 
    };

    console.log('Decoded token:', decoded); // Debug
    
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // Fetch users
    const users = await User.find({})
      .select('-password')
      .lean();

    return NextResponse.json(users);

  } catch (error) {
    console.error('API error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}