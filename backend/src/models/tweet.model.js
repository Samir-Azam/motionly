import mongoose, { Schema } from 'mongoose';

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      trim: true,
      required: true,
      index: true,
      maxlength: 280
    }
  },
  { timestamps: true }
);

export const Tweet = mongoose.model('Tweet', tweetSchema);
