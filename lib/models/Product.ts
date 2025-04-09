/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model, models, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  abbreviation?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [50, 'Product name cannot exceed 50 characters']
  },
  abbreviation: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [10, 'Abbreviation cannot exceed 10 characters'],
    default: '',
    validate: {
      validator: function(v: string) {
        // Only allow letters and numbers
        return !v || /^[A-Z0-9]*$/.test(v);
      },
      message: 'Abbreviation can only contain letters and numbers'
    }
  },
  image: {
    type: String,
    default: '',
    validate: {
      validator: function(v: string) {
        return !v || v.startsWith('https://');
      },
      message: (props: any) => `Invalid image URL format: ${props.value}`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
ProductSchema.index({ name: 1 }, { unique: true });
ProductSchema.index({ abbreviation: 1 }, { sparse: true }); // Sparse index since field is optional
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ updatedAt: -1 });

// Update timestamp on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default models.Product || model<ProductDocument>('Product', ProductSchema);