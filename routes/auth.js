const path = require("path")
const express = require("express");
const registerAuth = require(path.join(__dirname, "..", "controllers/register-auth"))
const loginAuth = require(path.join(__dirname, "..", "controllers/login-auth"))
const savingDepositAuth = require(path.join(__dirname, "..", "controllers/saving-deposit-auth"))
const savingWithdrawAuth = require(path.join(__dirname, "..", "controllers/saving-withdraw-auth"))
const checkingDepositAuth = require(path.join(__dirname, "..", "controllers/checking-deposit-auth"))
const checkingWithdrawAuth = require(path.join(__dirname, "..", "controllers/checking-withdraw-auth"))

const router = express.Router();

router.post("/register", registerAuth.register)
router.post("/login", loginAuth.register)
router.post("/saving/deposit", savingDepositAuth.register)
router.post("/saving/withdraw" , savingWithdrawAuth.register)
router.post("/checking/deposit", checkingDepositAuth.register)
router.post("/checking/withdraw", checkingWithdrawAuth.register)

module.exports = router;