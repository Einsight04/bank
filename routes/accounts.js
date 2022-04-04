const path = require("path")
const express = require("express");
const accountMenu = require(path.join(__dirname, "..", "account-info/account-menu"))
const checkingAccount = require(path.join(__dirname, "..", "account-info/checking-account"))
const savingAccount = require(path.join(__dirname, "..", "account-info/saving-account"))


const router = express.Router();

router.get("/menu", accountMenu.register)
router.get("/checking", checkingAccount.register)
router.get("/saving", savingAccount.register)


module.exports = router;


