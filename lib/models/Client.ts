import { Schema, model, models, Document } from 'mongoose';

export interface ClientProduct {
  name: string;
  characteristics: Record<string, any>;
  subProducts: Array<{
    name: string;
    specifications: Record<string, any>;
  }>;
}

export interface ClientDocument extends Document {
  name: string;
  email: string;
  status: 'active' | 'inactive';
  phone?: string;
  address?: string;
  products: ClientProduct[];
}

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { 
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  phone: String,
  address: String,
  products: [{
    name: { type: String, required: true },
    characteristics: Schema.Types.Mixed,
    subProducts: [{
      name: String,
      specifications: Schema.Types.Mixed
    }]
  }]
});

export default models.Client || model<ClientDocument>('Client', ClientSchema);