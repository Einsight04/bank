const path = require("path")
const express = require("express");
const registerAuth = require(path.join(__dirname, "..", "controllers/register-auth"))
const loginAuth = require(path.join(__dirname, "..", "controllers/login-auth"))

const router = express.Router();

router.post("/register", registerAuth.register)
router.post("/login", loginAuth.register)

module.exports = router;