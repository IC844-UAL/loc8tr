const mongoose = require("mongoose");
const location = mongoose.model("Location");

const respondJson = (res, status, content) => {
  res.status(status).json(content);
};

const recalculateRating = async (place) => {
  if (!place.reviews || place.reviews.length === 0) {
    place.rating = 0;
  } else {
    const total = place.reviews.reduce((sum, review) => sum + review.rating, 0);
    place.rating = Math.round(total / place.reviews.length);
  }
  await place.save();
};

const updateAverageRating = async (locationid) => {
  const place = await location.findById(locationid).select("rating reviews");
  if (place) {
    await recalculateRating(place);
  }
};

const createReview = async (req, res) => {
  const locationId = req.params.locationid;
  if (!locationId) {
    return respondJson(res, 404, { message: "locationid not found" });
  }

  try {
    const place = await location.findById(locationId).select("reviews");
    if (!place) {
      return respondJson(res, 404, { message: "locationid not found" });
    }

    place.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText,
    });

    const savedPlace = await place.save();
    await updateAverageRating(savedPlace._id);
    const newReview = savedPlace.reviews[savedPlace.reviews.length - 1];
    return respondJson(res, 201, newReview);
  } catch (err) {
    return respondJson(res, 400, err);
  }
};

const getReviewById = async (req, res) => {
  const { locationid, reviewid } = req.params;
  try {
    const place = await location.findById(locationid).select("name reviews");
    if (!place) {
      return respondJson(res, 404, { message: "locationid not found" });
    }
    const review = place.reviews.id(reviewid);
    if (!review) {
      return respondJson(res, 404, { message: "reviewid not found" });
    }
    return respondJson(res, 200, {
      location: { name: place.name, id: locationid },
      review,
    });
  } catch (err) {
    return respondJson(res, 400, err);
  }
};

const updateReviewById = async (req, res) => {
  const { locationid, reviewid } = req.params;
  if (!locationid || !reviewid) {
    return respondJson(res, 404, { message: "locationid and reviewid are required" });
  }

  try {
    const place = await location.findById(locationid).select("reviews");
    if (!place) {
      return respondJson(res, 404, { message: "location not found" });
    }

    const reviewToUpdate = place.reviews.id(reviewid);
    if (!reviewToUpdate) {
      return respondJson(res, 404, { message: "reviewid not found" });
    }

    reviewToUpdate.author = req.body.author;
    reviewToUpdate.rating = req.body.rating;
    reviewToUpdate.reviewText = req.body.reviewText;

    await place.save();
    await updateAverageRating(place._id);
    return respondJson(res, 200, reviewToUpdate);
  } catch (err) {
    return respondJson(res, 400, err);
  }
};

const removeReviewById = async (req, res) => {
  const { locationid, reviewid } = req.params;
  if (!locationid || !reviewid) {
    return respondJson(res, 404, { message: "locationid and reviewid are required" });
  }

  try {
    const place = await location.findById(locationid).select("reviews");
    if (!place) {
      return respondJson(res, 404, { message: "locationid not found" });
    }
    const reviewToDelete = place.reviews.id(reviewid);
    if (!reviewToDelete) {
      return respondJson(res, 404, { message: "reviewid not found" });
    }

    reviewToDelete.deleteOne();
    await place.save();
    await updateAverageRating(place._id);
    return respondJson(res, 204, null);
  } catch (err) {
    return respondJson(res, 400, err);
  }
};

module.exports = {
  createReview,
  getReviewById,
  updateReviewById,
  removeReviewById,
};
