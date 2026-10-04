const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Set the author of the review to the current user
  console.log("new review", newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","Successfully added a new review!");
  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview=async (req, res) => {
  console.log("delete review route");
  console.log(req.params);
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Successfully deleted a review!");
  res.redirect(`/listings/${id}`);
};