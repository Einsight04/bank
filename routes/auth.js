const path = require("path")
const express = require("express");
const registerAuth = require(path.join(__dirname, "..", "controllers/register-auth"))
const loginAuth = require(path.join(__dirname, "..", "controllers/login-auth"))
const {UpdateBalance} = require("../inheritance/inherit");


const router = express.Router();

router.post("/register", registerAuth.register)
router.post("/login", loginAuth.register)

router.post("/saving/deposit", (req, res) => {
    let {deposit} = req.body;
    (new UpdateBalance("saving", deposit, req.cookies["UUID"], res)).deposit();
})
router.post("/saving/withdraw" , (req, res) => {
    let {withdraw} = req.body;
    (new UpdateBalance("saving", withdraw, req.cookies["UUID"], res)).withdraw();
})
router.post("/checking/deposit", (req, res) => {
    let {deposit} = req.body;
    (new UpdateBalance("checking", deposit, req.cookies["UUID"], res)).deposit();
})
router.post("/checking/withdraw", (req, res) => {
    let {withdraw} = req.body;
    (new UpdateBalance("checking", withdraw, req.cookies["UUID"], res)).withdraw();
})


module.exports = router;