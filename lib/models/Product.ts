/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/models/Product.ts
import { Schema, model, models, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  image?: string;
  createdAt: Date;
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
  image: {
    type: String,
    default: '',
    // validate: {
    //   validator: function(v: string) {
    //     // Validate existing images but allow empty values
    //     return !v || /^\/uploads\/[a-f0-9-]+-[^\/]+$/.test(v);
    //   },
    //   message: (props: any) => `Invalid image path format: ${props.value}`
    // }
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
  }
});


ProductSchema.pre('save', function(next) {
  if (!this.image) this.image = '';
  next();
});


ProductSchema.index({ name: 1 }, { unique: true });
ProductSchema.index({ createdAt: -1 });

export default models.Product || model<ProductDocument>('Product', ProductSchema);