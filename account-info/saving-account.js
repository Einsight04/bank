const mysqldb = require("../db-connection/mysql")

exports.register = (req, res) => {
    const db = mysqldb.sqlDb()

    if (!req.cookies["UUID"]) {
        return res.redirect("index")
    }

    db.query("SELECT * FROM users WHERE uuid = ?", req.cookies["UUID"], async (err, results) => {
        if (!results[0].saving) {
            return res.render("account", {
                account: "Saving",
                balance: "0"
            });
        } else {
            return res.render("account", {
                account: "Saving",
                balance: results[0].saving
            });
        }


    });


}