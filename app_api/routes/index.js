const express = require("express");
const router = express.Router();
const locationApi = require("../controllers/locations");
const reviewApi = require("../controllers/reviews");

router.get("/locations", locationApi.listLocations);
router.post("/locations", locationApi.createLocation);
router.get("/locations/:locationid", locationApi.getLocationById);
router.put("/locations/:locationid", locationApi.updateLocationById);
router.delete("/locations/:locationid", locationApi.removeLocationById);

router.post("/locations/:locationid/reviews", reviewApi.createReview);
router.get("/locations/:locationid/reviews/:reviewid", reviewApi.getReviewById);
router.put("/locations/:locationid/reviews/:reviewid", reviewApi.updateReviewById);
router.delete("/locations/:locationid/reviews/:reviewid", reviewApi.removeReviewById);

module.exports = router;
