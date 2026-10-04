const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const { listingSchema } = require("../schema.js");

const Listing = require("../models/listing.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middlewares.js");

const listingsController = require("../controllers/listings.js");

const multer = require("multer");
const cloudinary = require("../cloudConfig.js");

// Multer
const upload = multer({
    storage: multer.memoryStorage()
});



router
    .route("/")
    .get(
        wrapAsync(listingsController.index)
    )
    .post(
        isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        wrapAsync(listingsController.createListing)
    );


router.get(
    "/new",
    isLoggedIn,
    listingsController.renderNewForm
);




router
    .route("/:id")

    // SHOW LISTING
    .get(
        wrapAsync(listingsController.showListing)
    )

    // UPDATE LISTING
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingsController.updateListing)
    )

    // DELETE LISTING
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingsController.deleteListing)
    );




router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    listingsController.renderEditForm
);


module.exports = router;