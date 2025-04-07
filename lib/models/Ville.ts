import { Schema, model, models, Document } from 'mongoose';
import { RegionDocument } from './Region';

export interface VilleDocument extends Document {

    name: string;
    region: Schema.Types.ObjectId | RegionDocument;
  }

const VilleSchema = new Schema<VilleDocument>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  }
});

export default models.Ville || model<VilleDocument>('Ville', VilleSchema);