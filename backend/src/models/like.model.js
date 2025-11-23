import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema(
  {
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },
    targetType: {
      type: String,
      required: true,
      enum: ['video', 'comment', 'tweet'],
      index: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate likes by same user on same target
likeSchema.index({ likedBy: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Like = mongoose.model('Like', likeSchema);
