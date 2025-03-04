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
    required: true,
    unique: true,
    trim: true
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProductSchema.index({ name: 1 }, { unique: true });

export default models.Product || model<ProductDocument>('Product', ProductSchema);