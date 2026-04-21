const mongoose = require("mongoose");
require("dotenv").config();
require("../app_server/models/locations");

const Location = mongoose.model("Location");
const buildMongoURI = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const host = process.env.MONGO_HOST || "127.0.0.1";
  const port = process.env.MONGO_PORT || "27017";
  const database = process.env.MONGO_DATABASE || "mean-project";
  const user = process.env.MONGO_ROOT_USER;
  const password = process.env.MONGO_ROOT_PASSWORD;

  if (user && password) {
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?authSource=admin`;
  }

  return `mongodb://${host}:${port}/${database}`;
};

const dbURI = buildMongoURI();
const shouldReset = process.argv.includes("--reset");

const seedData = [
  {
    name: "Starcups",
    address: "125 High Street, Reading, RG6 1PS",
    rating: 4,
    facilities: ["Hot drinks", "Food", "Premium wifi"],
    coords: { type: "Point", coordinates: [-0.9690884, 51.455041] },
    openingTimes: [
      { days: "Monday - Friday", opening: "7:00am", closing: "7:00pm", closed: false },
      { days: "Saturday", opening: "8:00am", closing: "5:00pm", closed: false },
      { days: "Sunday", closed: true },
    ],
    reviews: [
      { author: "Simon Holmes", rating: 3, reviewText: "What a great place." },
      { author: "Antonio Becerra", rating: 4, reviewText: "It was okay. Coffee wasn't great." },
    ],
  },
  {
    name: "Cafe Hero",
    address: "London Road, Reading, RG1 1PS",
    rating: 5,
    facilities: ["Coffee", "Snacks", "Fast wifi"],
    coords: { type: "Point", coordinates: [-0.9710884, 51.457041] },
    openingTimes: [
      { days: "Monday - Friday", opening: "7:30am", closing: "6:30pm", closed: false },
      { days: "Saturday - Sunday", opening: "8:00am", closing: "4:00pm", closed: false },
    ],
    reviews: [],
  },
];

async function runSeed() {
  try {
    await mongoose.connect(dbURI);
    console.log(`Connected to ${dbURI}`);

    if (shouldReset) {
      await Location.deleteMany({});
      console.log("Existing locations deleted.");
    }

    const existingCount = await Location.countDocuments();
    if (existingCount > 0 && !shouldReset) {
      console.log("Locations already exist. Use --reset to reload.");
      return;
    }

    await Location.insertMany(seedData);
    console.log("Seed data loaded successfully.");
  } catch (error) {
    console.error("Failed to seed data:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

runSeed();
