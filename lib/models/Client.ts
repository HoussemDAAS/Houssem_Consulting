// lib/models/Client.ts
import { Schema, model, models, Document } from 'mongoose';
import { ProductDocument } from './Product';

export interface ClientDocument extends Document {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  products: {
    product: ProductDocument['_id'];
    subProducts: string[];
  }[];
}

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: String,
  phone: String,
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    subProducts: [String]
  }]
});

export default models.Client || model<ClientDocument>('Client', ClientSchema);