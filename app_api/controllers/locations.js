const mongoose = require("mongoose");
const PlaceModel = mongoose.model("Location");

const respondJson = (res, status, content) => {
  res.status(status).json(content);
};

const parseFacilities = (facilities) => {
  if (Array.isArray(facilities)) {
    return facilities;
  }
  if (typeof facilities === "string" && facilities.trim()) {
    return facilities.split(",").map((f) => f.trim());
  }
  return [];
};

const buildPlacePayload = (body) => ({
  name: body.name,
  address: body.address,
  facilities: parseFacilities(body.facilities),
  coords: {
    type: "Point",
    coordinates: [parseFloat(body.lng), parseFloat(body.lat)],
  },
  openingTimes: [
    {
      days: body.days1,
      opening: body.opening1,
      closing: body.closing1,
      closed: body.closed1 === true || body.closed1 === "true",
    },
    {
      days: body.days2,
      opening: body.opening2,
      closing: body.closing2,
      closed: body.closed2 === true || body.closed2 === "true",
    },
  ],
});

const listLocations = async (req, res) => {
  try {
    const places = await PlaceModel.find({});
    respondJson(res, 200, places);
  } catch (err) {
    respondJson(res, 500, err);
  }
};

const getLocationById = async (req, res) => {
  try {
    const place = await PlaceModel.findById(req.params.locationid);
    if (!place) {
      return respondJson(res, 404, { message: "location not found" });
    }
    return respondJson(res, 200, place);
  } catch (err) {
    return respondJson(res, 400, err);
  }
};

const createLocation = async (req, res) => {
  try {
    const payload = buildPlacePayload(req.body);
    const createdPlace = await PlaceModel.create(payload);
    respondJson(res, 201, createdPlace);
  } catch (err) {
    respondJson(res, 400, err);
  }
};

const updateLocationById = async (req, res) => {
  if (!req.params.locationid) {
    return respondJson(res, 404, { message: "locationid is required" });
  }

  try {
    const place = await PlaceModel.findById(req.params.locationid).select("-reviews -rating");
    if (!place) {
      return respondJson(res, 404, { message: "locationid not found" });
    }

    const payload = buildPlacePayload(req.body);
    place.name = payload.name;
    place.address = payload.address;
    place.facilities = payload.facilities;
    place.coords = payload.coords;
    place.openingTimes = payload.openingTimes;

    const savedPlace = await place.save();
    return respondJson(res, 200, savedPlace);
  } catch (err) {
    return respondJson(res, 400, err);
  }
};

const removeLocationById = async (req, res) => {
  const locationid = req.params.locationid;
  if (!locationid) {
    return respondJson(res, 404, { message: "No locationid" });
  }

  try {
    await PlaceModel.findByIdAndDelete(locationid);
    return respondJson(res, 200, { message: `Location id ${locationid} deleted` });
  } catch (err) {
    return respondJson(res, 400, err);
  }
};

module.exports = {
  listLocations,
  createLocation,
  getLocationById,
  updateLocationById,
  removeLocationById,
};
