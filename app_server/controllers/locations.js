const { getLocations, getLocationById, addLocationReview } = require("../services/apiService");

const showViewError = (res, status, message) => {
  res.status(status).render("error", {
    message: message || "Something went wrong",
    error: { status },
  });
};

const homelist = async (req, res) => {
  try {
    const { status, data } = await getLocations();
    if (status !== 200 || !Array.isArray(data)) {
      return showViewError(res, status || 500, "Could not load locations from the API.");
    }
    res.render("locations-list", {
      title: "Home | Mean Project",
      locations: data,
      listMessage: data.length === 0 ? "No places found." : null,
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
    if (!locationId) {
      const { status, data } = await getLocations();
      if (status !== 200 || !Array.isArray(data) || !data.length) {
        return showViewError(res, 404, "No locations available.");
      }
      return res.render("location-info", {
        title: `${data[0].name} | Mean Project`,
        location: data[0],
      });
    }

    const { status, data } = await getLocationById(locationId);
    if (status !== 200 || !data) {
      return showViewError(res, status, "Location not found");
    }
    return res.render("location-info", {
      title: `${data.name} | Mean Project`,
      location: data,
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
    const { status, data } = await getLocationById(req.params.locationid);
    if (status !== 200 || !data) {
      return showViewError(res, status || 404, "Location not found");
    }
    return res.render("location-review-form", {
      title: `Review ${data.name} | Mean Project`,
      location: data,
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

  if (!name || !review || rating === undefined || rating === "") {
    const detail = await getLocationById(locationId);
    const locationPayload =
      detail.status === 200 && detail.data ? detail.data : { name: "Location", _id: locationId };
    return res.status(400).render("location-review-form", {
      title: `Review ${locationPayload.name} | Mean Project`,
      location: locationPayload,
      formError: "All fields are required.",
    });
  }

  try {
    const { status } = await addLocationReview(locationId, {
      author: name,
      rating: Number(rating),
      reviewText: review,
    });

    if (status === 201) {
      return res.redirect(`/location/${locationId}`);
    }
    return showViewError(res, status || 502, "Could not submit review via the API.");
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
