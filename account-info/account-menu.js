const path = require("path");
const db = require("../db-connection/mysql");

exports.register = (req, res) => {
    db.query("SELECT 1 FROM users WHERE uuid = ?", [req.cookies["UUID"]], async (err, exists) => {
        if (exists.length > 0) {
            return res.render(path.join(__dirname, "..", "/views/menu"));
        } else {
            return res.redirect("/404");
        }
    });
};