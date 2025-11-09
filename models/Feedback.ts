import mongoose, { Schema, Document, Model } from 'mongoose';
import toJSON from './plugins/toJSON';

export interface FeedbackDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  rating: 'sad' | 'mid' | 'happy';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true, index: true },
    rating: { type: String, enum: ['sad', 'mid', 'happy'], required: true },
    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

feedbackSchema.plugin(toJSON);

const Feedback: Model<FeedbackDocument> =
  mongoose.models.Feedback || mongoose.model<FeedbackDocument>('Feedback', feedbackSchema);

export default Feedback;
