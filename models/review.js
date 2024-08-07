import mongoose from "mongoose";
import { User } from "./user.js";
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const Review = mongoose.model("Review", reviewSchema);
export { Review };
