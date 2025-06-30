import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IDocument extends Document {
ownerId: ObjectId;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  encryptedAESKey: string;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  s3Key: { type: String, required: true },
  encryptedAESKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
