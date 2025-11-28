import mongoose, { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';


const playlistVideoSchema = new Schema(
  {
    playlist: {
      type: Schema.Types.ObjectId,
      ref: 'Playlist',
      required: true,
      index: true
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
      index: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate video entries inside the same playlist
playlistVideoSchema.index({ playlist: 1, video: 1 }, { unique: true });

playlistVideoSchema.plugin(aggregatePaginate);

export const PlaylistVideo = mongoose.model(
  'PlaylistVideo',
  playlistVideoSchema
);
