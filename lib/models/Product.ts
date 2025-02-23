import { Schema, model, models, Document } from 'mongoose';

export interface ProductDocument extends Document {
  _id: string;
  name: string;
  fabricant: string;
  modele: string;
  reference: string;
  plageMesure: string;
  annee: number;
  versionLogiciel: string;
  autreInformation?: string;
  subProducts: Array<{
    name: string;
    specifications: string;
  }>;
}

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  fabricant: { type: String },
  modele: { type: String },
  reference: { type: String },
  plageMesure: { type: String },
  annee: { type: Number },
  versionLogiciel: { type: String },
  autreInformation: String,
  subProducts: [{
    name: String,
    specifications: String
  }]
});

export default models.Product || model<ProductDocument>('Product', ProductSchema);