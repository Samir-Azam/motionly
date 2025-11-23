import mongoose, { Schema } from 'mongoose';

const playlistSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

playlistSchema.index({ owner: 1, name: 1 }, { unique: true });

export const Playlist = mongoose.model('Playlist', playlistSchema);
