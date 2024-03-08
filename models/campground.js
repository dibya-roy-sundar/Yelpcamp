import mongoose, { Mongoose } from "mongoose";
import { Review } from "./review.js";

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});
const campgroundSchema = new Schema({
  title: String,
  description: String,
  images: [ImageSchema],
  price: Number,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);
export { Campground };
