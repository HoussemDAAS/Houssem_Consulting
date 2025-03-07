/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      await dbConnect();
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1];
      const body = await request.json();
  
      if (!token) {
        return NextResponse.json(
          { error: 'Authorization token required' },
          { status: 401 }
        );
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
        userId: string, 
        role: string 
      };
  
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin privileges required' },
          { status: 403 }
        );
      }
  
      if (!body.name?.trim() || !body.email?.trim()) {
        return NextResponse.json(
          { error: 'Name and email are required' },
          { status: 400 }
        );
      }
  
      const existingUser = await User.findOne({
        email: body.email.trim(),
        _id: { $ne: params.id }
      });
  
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
  
      const updateData: any = {
        name: body.name.trim(),
        email: body.email.trim(),
        role: body.role
      };
  
      if (body.password) {
        updateData.password = await bcrypt.hash(body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        params.id,
        updateData,
        { new: true }
      ).select('-password');
  
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(updatedUser);
  
    } catch (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Update failed' },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      await dbConnect();
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1];
  
      if (!token) {
        return NextResponse.json(
          { error: 'Authorization token required' },
          { status: 401 }
        );
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
        userId: string, 
        role: string 
      };
  
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin privileges required' },
          { status: 403 }
        );
      }
  
      if (params.id === decoded.userId) {
        return NextResponse.json(
          { error: 'Cannot delete yourself' },
          { status: 403 }
        );
      }
  
      const deletedUser = await User.findByIdAndDelete(params.id);
      if (!deletedUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ success: true });
  
    } catch (error) {
      console.error('Deletion error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Deletion failed' },
        { status: 500 }
      );
    }
  }