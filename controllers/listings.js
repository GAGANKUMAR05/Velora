const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}
module.exports.renderNewForm= (req, res) => {
  res.render("listings/new.ejs");
}
module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");
  if(!listing){
    req.flash("error","Cannot find that listing!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs",{listing});
}
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()

// res.send("done!");
  const newListing = new Listing(req.body.listing);
  newListing.geometry = response.body.features[0].geometry;
  let saved;
  newListing.owner = req.user._id;

  // Cloudinary image
  if (req.file) {
    const cloudinary = require("../cloudConfig.js");

    const result = await new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "Velora_DEV"
        },
        (error, result) => {

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }

        }
      );

      stream.end(req.file.buffer);
    });

    newListing.image = {
      url: result.secure_url,
      filename: result.public_id
    };
  }

  await newListing.save();

  req.flash("success", "Successfully made a new listing!");

  res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // let OriginalImageUrl = listing.image.url;
  // OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/h_300,/w_250");
   res.render("listings/edit.ejs", { listing });
}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    // Text data update
    Object.assign(listing, req.body.listing);

    // Location ko coordinates mein convert karo
    if (req.body.listing.location) {
        const response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            })
            .send();

        if (response.body.features.length > 0) {
            listing.geometry = response.body.features[0].geometry;
        }
    }

    // Agar new image select ki hai
    if (req.file) {

        const cloudinary = require("../cloudConfig.js");

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "Velora_DEV"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        // New image ka Cloudinary data save
        listing.image = {
            url: result.secure_url,
            filename: result.public_id
        };
    }

    await listing.save();

    req.flash("success", "Successfully updated a listing!");

    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Successfully deleted a listing!");
  res.redirect("/listings");
}