import { Schema, model, models, Document } from 'mongoose';

export interface SecteurDocument extends Document {
  name: string;
  code: string;
}

const SecteurSchema = new Schema<SecteurDocument>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 5
  }
});

export default models.Secteur || model<SecteurDocument>('Secteur', SecteurSchema);