const mysqldb = require("../db-connection/mysql")
// const mysqldb = require("../inheritance/inherit")

exports.register = (req, res) => {
    const db = mysqldb.sqlDb()

    if (!req.cookies["UUID"]) {
        return res.redirect("index")
    }

    console.log('test')

    db.query("SELECT * FROM users WHERE uuid = ?", req.cookies["UUID"], async (err, results) => {
        if (!results[0].checking) {
            return res.render("account", {
                account: "Checking",
                balance: "0"
            });
        } else {
            return res.render("account", {
                account: "Checking",
                balance: Math.round((results[0].checking + Number.EPSILON) * 100) / 100
            });

        }
    });
}