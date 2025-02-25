// lib/models/User.ts
import { Schema, model, models } from 'mongoose';

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (v: string) => /\S+@\S+\.\S+/.test(v),
      message: 'Invalid email format'
    }
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user',
    required: true
  }
});

// Add index for better query performance
userSchema.index({ email: 1 }, { unique: true });

export default models.User || model<UserDocument>('User', userSchema);