const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing");
const { isLoggedIn,isOwner,validateListing }=require("../middleware.js");
const Review=require("../models/review.js");
const { validateReview }=require("../middleware.js");
const listingcontroller=require("../controller/listings.js");
const multer  = require('multer');
const { storage }=require("../cloudConfig.js");
const upload = multer({ storage });

/// New route
router.get("/new",isLoggedIn,listingcontroller.rendernewform);

router.route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingcontroller.createListing))
    
//     .post('/profile', upload.single('avatar'), function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
// })


router.route("/:id")
    .get(wrapAsync(listingcontroller.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,
    wrapAsync(listingcontroller.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.destroyListing));

/// Index Route
// router.get("/",wrapAsync(listingcontroller.index));

/// Show Route
// router.get("/:id",wrapAsync(listingcontroller.showListing));

/// Create Route
// router.post(
//     "/",isLoggedIn,validateListing,
//     wrapAsync(listingcontroller.createListing));

/// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.renderEditForm));

/// Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,
//     wrapAsync(listingcontroller.updateListing));

// Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingcontroller.destroyListing));

// neglect
router.get("/:id/reviews/:reviewId",isLoggedIn,async(req,res)=>{
    let {reviewId} =req.params;
    let Review=await Review.findById(reviewId);
    let listing = await Listing.findById(req.params.id);
    res.redirect("/:id/reviews",{Review},{listing});
});

module.exports = router;