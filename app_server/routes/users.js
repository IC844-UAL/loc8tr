const express = require("express");
const router = express.Router();
const ctrlUsers = require("../controllers/users");

router.get("/", ctrlUsers.index);

module.exports = router;
