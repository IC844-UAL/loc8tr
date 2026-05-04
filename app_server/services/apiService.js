require("dotenv").config();

const defaultPort = () => process.env.PORT || "3000";

const serviceBaseUrl = () => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL.replace(/\/$/, "");
  }
  return `http://127.0.0.1:${defaultPort()}`;
};

const parseJsonBody = (text) => {
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const requestJson = async (path, init = {}) => {
  const url = `${serviceBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const text = await res.text();
  const data = parseJsonBody(text);
  return { status: res.status, ok: res.ok, data };
};

const getLocations = () => requestJson("/api/locations", { method: "GET" });

const getLocationById = (id) => requestJson(`/api/locations/${id}`, { method: "GET" });

const addLocationReview = (locationId, payload) =>
  requestJson(`/api/locations/${locationId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

module.exports = {
  serviceBaseUrl,
  getLocations,
  getLocationById,
  addLocationReview,
};
