import { Schema, model, models, Document } from 'mongoose';

export interface RegionDocument extends Document {
  name: string;
  code: string; // Example: "TN"
}

const RegionSchema = new Schema<RegionDocument>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    maxlength: 5
  }
});

export default models.Region || model<RegionDocument>('Region', RegionSchema);