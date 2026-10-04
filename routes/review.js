const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middlewares.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewsController=require("../controllers/reviews.js");

//Reviews
//post routes
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewsController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.destroyReview));

module.exports = router;