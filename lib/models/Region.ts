import mongoose, { Schema, Document } from 'mongoose';

export interface RegionDocument extends Document {
  name: string;
  code: string;
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
export default mongoose.models?.Region || mongoose.model<RegionDocument>('Region', RegionSchema);