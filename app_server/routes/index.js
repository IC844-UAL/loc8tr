const express = require("express");
const router = express.Router();
const ctrlLocations = require("../controllers/locations");
const ctrlOthers = require("../controllers/others");

router.get("/", ctrlLocations.homelist);
router.get("/location", ctrlLocations.locationInfo);
router.get("/location/:locationid", ctrlLocations.locationInfo);
router.get("/location/:locationid/review/new", ctrlLocations.addReview);
router.post("/location/:locationid/review/new", ctrlLocations.doAddReview);
router.get("/about", ctrlOthers.about);

module.exports = router;
