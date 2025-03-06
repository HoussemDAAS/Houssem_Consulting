import { Schema, model, models, Document } from 'mongoose';

export interface VilleDocument extends Document {

    name: string;
  }

const VilleSchema = new Schema<VilleDocument>({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

export default models.Ville || model<VilleDocument>('Ville', VilleSchema);