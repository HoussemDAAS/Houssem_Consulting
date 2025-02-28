import { Schema, model, models, Document } from 'mongoose';

export interface ClientContact {
  fullName: string;
  phoneNumber: string;
}

export interface ClientSubProduct {
  name: string;
  specifications: string;
}

export interface ClientProduct {
  product: Schema.Types.ObjectId; // Reference to simple Product
  modele: string;
  reference: string;
  plageMesure: string;
  annee: string;
  versionLogiciel: string;
  autreInformation: string;
  subProducts: ClientSubProduct[];
  addedAt: Date;
}

export interface ClientDocument extends Document {
  // ... other fields
  products: ClientProduct[];
}

export interface ClientDocument extends Document {
  name: string;
  region: Schema.Types.ObjectId;
  address: string;
  email: string;
  contacts: ClientContact[];
  products: ClientProduct[];
  createdAt: Date;
}

const ClientSchema = new Schema<ClientDocument>({
  name: {
    type: String,
    required: true
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
  },
  contacts: [{
    fullName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{8,15}$/ // Basic phone number validation
    }
  }],
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    subProducts: [String],
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
ClientSchema.index({ region: 1 });
ClientSchema.index({ email: 1 }, { unique: true });
ClientSchema.index({ 'contacts.phoneNumber': 1 });

export default models.Client || model<ClientDocument>('Client', ClientSchema);