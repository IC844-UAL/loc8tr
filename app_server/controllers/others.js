const { getLocations } = require("../services/apiService");

const about = async (req, res) => {
  try {
    const { status, data } = await getLocations();
    const locationCount =
      status === 200 && Array.isArray(data) ? data.length : null;
    res.render("index", {
      title: "About | Mean Project",
      locationCount,
      apiUnavailable: status !== 200 || !Array.isArray(data),
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Could not load data from the API",
      error,
    });
  }
};

module.exports = {
  about,
};
