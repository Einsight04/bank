const db = require('../db-connection/mysql')
const {Saving} = require("../inheritance/inherit");
const path = require("path");

exports.register = (req, res) => {
    db.query("SELECT 1 FROM users WHERE uuid = ?", [req.cookies["UUID"]], async (err, exists) => {
        if (exists.length > 0) {
            db.query("SELECT * FROM users WHERE uuid = ?", req.cookies["UUID"], async (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log(`Saving Balance: ${results[0].saving}`);
                return res.render(path.join(__dirname, "..", "/views/account"), (new Saving(results[0].saving)).viewBalance(""));
            });
        } else {
            return res.redirect("/404");
        }
    });
}