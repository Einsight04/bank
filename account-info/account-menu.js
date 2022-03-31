const mysqldb = require("../db-connection/mysql")

exports.register = (req, res) => {
    const db = mysqldb.sqlDb()

    if (!req.cookies["UUID"]) {
        return res.redirect("index")
    }

    res.render("menu.hbs")

    db.query("SELECT checking FROM users WHERE uuid = ?", req.cookies["UUID"], async (err, checkingBalance) => {
        if (err) {
            console.log(err);
        }

        console.log(checkingBalance)
    });
}