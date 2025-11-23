import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

  },
  { timestamps: true }
);

// compound index - to prevent duplicate records

subscriptionSchema.index(
    {subscriber:1 , channel: 1},
    {unique: true}
)

// To prevent self subscription
subscriptionSchema.pre("save", function (next) {
  if (this.subscriber.equals(this.channel)) {
    throw new Error("User cannot subscribe to their own channel")
  }
  next();
});



export const Subscription = mongoose.model("Subscription", subscriptionSchema)