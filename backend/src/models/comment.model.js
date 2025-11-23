import mongoose, {Schema} from "mongoose"

const commentSchema = new Schema(
  {
    video:{
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true,
        required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema)