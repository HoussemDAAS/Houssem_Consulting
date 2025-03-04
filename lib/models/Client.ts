// Updated Client Schema (lib/models/Client.ts)
import { Schema, model, models, Document } from 'mongoose';

interface Contact {
  name: string;
  phoneNumber: string;
}

export interface ClientProduct {
  product: Schema.Types.ObjectId;
  fabriquant: string; // New field
  modele: string;
  reference: string;
  plageMesure: string;
  annee: string;
  versionLogiciel: string;
  autreInformation: string; // Replaces custom details
  addedAt: Date;
}

export interface ClientDocument extends Document {
  name: string;
  region: Schema.Types.ObjectId;
  address?: string;
  email?: string;
  contacts: Contact[]; // Restored contacts array
  products: ClientProduct[];
  createdAt: Date;
}

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
  address: { type: String, default: '' },
  email: { 
    type: String,
    unique: true,
    sparse: true,
    default: null
  },
  contacts: { // Restored contacts structure
    type: [{
      name: String,
      phoneNumber: String
    }],
    default: []
  },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    fabriquant: { type: String, default: '' }, // New field
    modele: { type: String, default: '' },
    reference: { type: String, default: '' },
    plageMesure: { type: String, default: '' },
    annee: { type: String, default: '' },
    versionLogiciel: { type: String, default: '' },
    autreInformation: { type: String, default: '' }, // Replaces details
    addedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
ClientSchema.index({ 'products.product': 1 });
ClientSchema.index({ name: 1 });

export default models.Client || model<ClientDocument>('Client', ClientSchema);