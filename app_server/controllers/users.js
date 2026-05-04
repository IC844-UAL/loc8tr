const { getLocations } = require("../services/apiService");

const index = async (req, res) => {
  try {
    const { status, data } = await getLocations();
    if (status !== 200 || !Array.isArray(data)) {
      return res.status(503).type("text").send("API unavailable.");
    }
    res.type("text").send(`Mean Project: ${data.length} location(s) from the REST API.`);
  } catch (error) {
    res.status(500).type("text").send("Error calling the API.");
  }
};

module.exports = {
  index,
};
