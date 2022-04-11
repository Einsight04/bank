const path = require("path")
const express = require("express");
const db = require(path.join(__dirname, "..", "/db-connection/mysql"));

const router = express.Router();


router.get("/", (req, res) => {
    return res.render(path.join(__dirname, "..", "/views/index"));
})

router.get("/register", (req, res) => {
    return res.render(path.join(__dirname, "..", "/views/register"));
})

router.get("/login", (req, res) => {
    db.query("SELECT 1 FROM users WHERE uuid = ?", [req.cookies["UUID"]], async (err, exists) => {
        if (exists.length > 0) {
            return res.redirect("/accounts/menu")
        } else {
            return res.render(path.join(__dirname, "..", "/views/login"));
        }
    });
})


module.exports = router;