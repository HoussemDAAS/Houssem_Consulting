/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated Client Schema (lib/models/Client.ts)
// Keep only these:
import { Schema, model, models, Document } from 'mongoose';
import './Secteur';  // Import for side effects
import './Ville';    // Import for side effects
import './Region';   // Import for side effects
import './Product';
interface Contact {
  firstName: string;
  lastName: string;
  service: string;
  position: string;
  email: string;
  phone: string;
}

export interface ClientProduct {
  product: Schema.Types.ObjectId;
  fabriquant: string;
  modele: string;
  reference: string;
  plageMesure: string;
  annee: string;
  versionLogiciel: string;
  autreInformation: string;
  addedAt: Date;
}

export interface ClientDocument extends Document {
  name: string;
  region: Schema.Types.ObjectId;
  address?: string;
  secteur?: Schema.Types.ObjectId;
  ville?: Schema.Types.ObjectId;
  contacts: Contact[];
  products: ClientProduct[];
  createdAt: Date;
}


const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
  address: { type: String, default: '' },
  ville: {
    type: Schema.Types.ObjectId,
    ref: 'Ville',
    default: null,
    validate: {
      validator: (v: any) => {
        if (v === null || v === undefined) return true;
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid ville reference'
    }
  },
  secteur: { 
    type: Schema.Types.ObjectId,
    ref: 'Secteur',
    default: null,
    validate: {
      validator: (v: any) => {
        if (v === null || v === undefined) return true;
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid secteur reference'
    }
  },
  contacts: {
    type: [{
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      service: { type: String, default: '' },
      position: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    }],
    default: []
  },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    fabriquant: { type: String, default: '' },
    modele: { type: String, default: '' },
    reference: { type: String, default: '' },
    plageMesure: { type: String, default: '' },
    annee: { type: String, default: '' },
    versionLogiciel: { type: String, default: '' },
    autreInformation: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
ClientSchema.index({ 'products.product': 1 });
ClientSchema.index({ name: 1 });

export default models.Client || model<ClientDocument>('Client', ClientSchema);