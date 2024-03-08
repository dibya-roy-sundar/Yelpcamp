import { Campground } from "./models/campground.js";
import { Review } from "./models/review.js";
import { campgroundschema, reviewschema } from "./schemas.js";
import { ExpressError } from "./utils/ExpresssError.js";

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
const validatecampground = (req, res, next) => {
  const { error } = campgroundschema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "you don't have permission to do that");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
};
const isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "you don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
const validatereview = (req, res, next) => {
  const { error } = reviewschema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
export {
  isLoggedIn,
  storeReturnTo,
  isAuthor,
  isReviewAuthor,
  validatecampground,
  validatereview,
};
