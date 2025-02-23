/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
    var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

// lib/dbConnect.ts
async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
      console.log('Using existing database connection');
      return cached.conn;
    }
  
    if (!cached.promise) {
      console.log('Creating new database connection');
      cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
        console.log('Database connected successfully');
        return mongoose;
      });
    }
  
    try {
      cached.conn = await cached.promise;
    } catch (error) {
      console.error('Database connection error:', error);
      cached.promise = null;
      throw error;
    }
  
    return cached.conn;
  }

export default dbConnect;