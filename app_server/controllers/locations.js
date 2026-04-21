const mongoose = require("mongoose");
const Location = mongoose.model("Location");

const homelist = async (req, res) => {
  try {
    const locations = await Location.find({}, "name address rating facilities").lean();
    res.render("locations-list", {
      title: "Home | Mean Project",
      locations,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error loading locations",
      error,
    });
  }
};

const locationInfo = async (req, res) => {
  try {
    const locationId = req.params.locationid;
    const location = locationId
      ? await Location.findById(locationId).lean()
      : await Location.findOne({}).lean();

    if (!location) {
      return res.status(404).render("error", {
        message: "Location not found",
        error: { status: 404 },
      });
    }

    return res.render("location-info", {
      title: `${location.name} | Mean Project`,
      location,
    });
  } catch (error) {
    return res.status(500).render("error", {
      message: "Error loading location details",
      error,
    });
  }
};

const addReview = async (req, res) => {
  try {
    const location = await Location.findById(req.params.locationid, "name").lean();
    if (!location) {
      return res.status(404).render("error", {
        message: "Location not found",
        error: { status: 404 },
      });
    }

    return res.render("location-review-form", {
      title: `Review ${location.name} | Mean Project`,
      location,
    });
  } catch (error) {
    return res.status(500).render("error", {
      message: "Error loading review form",
      error,
    });
  }
};

const doAddReview = async (req, res) => {
  const locationId = req.params.locationid;
  const { name, rating, review } = req.body;

  try {
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).render("error", {
        message: "Location not found",
        error: { status: 404 },
      });
    }

    if (!name || !review || !rating) {
      return res.status(400).render("location-review-form", {
        title: `Review ${location.name} | Mean Project`,
        location: location.toObject(),
        formError: "All fields are required.",
      });
    }

    location.reviews.push({
      author: name,
      rating: Number(rating),
      reviewText: review,
    });

    await location.save();
    return res.redirect(`/location/${locationId}`);
  } catch (error) {
    return res.status(500).render("error", {
      message: "Error saving review",
      error,
    });
  }
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview,
};
