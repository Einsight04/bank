const path = require("path")
const express = require("express");
const cookieParser = require('cookie-parser');
const registerAuth = require(path.join(__dirname, "..", "controllers/register-auth"))
const loginAuth = require(path.join(__dirname, "..", "controllers/login-auth"))
const accountAuth = require(path.join(__dirname, "..", "controllers/account-auth"))

const router = express.Router();

router.post("/register", registerAuth.register)
router.post("/login", loginAuth.register)
router.get("/accounts", accountAuth.register)




module.exports = router;