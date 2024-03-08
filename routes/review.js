import express from "express";
import { isLoggedIn, isReviewAuthor, validatereview } from "../middleware.js";
import { deleteReview, postReview } from "../controllers/reviews.js";

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validatereview, postReview);
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, deleteReview);

export default router;
