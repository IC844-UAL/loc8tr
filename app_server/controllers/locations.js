const homelist = (req, res) => {
  res.render("locations-list", { title: "Home | Mean Project" });
};

const locationInfo = (req, res) => {
  res.render("location-info", { title: "Location info | Mean Project" });
};

const addReview = (req, res) => {
  res.render("location-review-form", { title: "Add review | Mean Project" });
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
};
