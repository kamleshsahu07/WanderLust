const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema,reviewSchema }=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const { validateReview, isLoggedIn }=require("../middleware.js");
const {isOwner,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js")

//post route review
router.post("/",isLoggedIn, validateReview ,wrapAsync (reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,isOwner,wrapAsync(reviewController.destroyReview));

module.exports = router;