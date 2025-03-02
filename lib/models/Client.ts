import { Schema, model, models, Document } from 'mongoose';

export interface ProductDetail {
  name: string;
  value: string;
}

export interface ClientProduct {
  product: Schema.Types.ObjectId;
  modele: string;
  reference: string;
  plageMesure: string;
  annee: string;
  versionLogiciel: string;
  autreInformation: string;
  details: ProductDetail[];
  addedAt: Date;
}

export interface ClientDocument extends Document {
  name: string;
  region: Schema.Types.ObjectId;
  address?: string;
  email?: string;
  products: ClientProduct[];
  createdAt: Date;
}

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
  address: { 
    type: String, 
    required: false,
    index: false 
  },
  email: { 
    type: String, 
    required: false,
    index: false 
  },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    modele: String,
    reference: String,
    plageMesure: String,
    annee: String,
    versionLogiciel: String,
    autreInformation: String,
    details: [{
      name: String,
      value: String
    }],
    addedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default models.Client || model<ClientDocument>('Client', ClientSchema);