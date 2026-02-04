const express = require("express");
const router = express.Router();
const { handleUserSignup, handleUserLogin } = require("../controllers/user");
const { route } = require("./url");


router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;