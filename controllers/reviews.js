import { Campground } from "../models/campground.js";
import { Review } from "../models/review.js";
import { catchAsync } from "../utils/catchAsync.js";

const postReview = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});
const deleteReview = catchAsync(async (req, res, next) => {
  const { id, reviewid } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/campgrounds/${id}`);
});

// function calculateAverage(reviews) {
//     if (reviews.length === 0) {
//         return 0;
//     }
//     var sum = 0;
//     reviews.forEach(function (element) {
//         sum += element.rating;
//     });
//     return sum / reviews.length;
// }

export { postReview, deleteReview };
