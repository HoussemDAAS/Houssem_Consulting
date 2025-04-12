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
    required: true,
    index: true // Add index for better performance
  }
});
VilleSchema.index({ region: 1, name: 1 });
export default models.Ville || model<VilleDocument>('Ville', VilleSchema);