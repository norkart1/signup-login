import mongoose, { Schema, Document } from 'mongoose';

export interface IDetail extends Document {
  title: string;
  description: string;
  createdAt: Date;
}

const DetailSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Detail || mongoose.model<IDetail>('Detail', DetailSchema);