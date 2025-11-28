import mongoose, { Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const watchHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
      index: true
    },
    watchedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

watchHistorySchema.index({ user: 1, video: 1 }, { unique: true });
watchHistorySchema.plugin(aggregatePaginate);

export const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
