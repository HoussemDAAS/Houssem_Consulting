/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}