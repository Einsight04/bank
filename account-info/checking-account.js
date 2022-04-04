const db = require('../db-connection/mysql')
const {Checking} = require("../inheritance/inherit");

exports.register = (req, res) => {
    db.query("SELECT 1 FROM users WHERE uuid = ?", [req.cookies["UUID"]], async (err, exists) => {
        if (exists.length > 0) {
            db.query("SELECT * FROM users WHERE uuid = ?", req.cookies["UUID"], async (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log(`Checking Balance: ${results[0].checking}`);
                return res.render("account", (new Checking(results[0].checking)).viewBalance());
            });
        } else {
            return res.redirect("/404");
        }
    });
}