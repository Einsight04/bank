const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    if (req.cookies['Identifier']) {
        res.render("accounts")
    } else {
        return res.redirect("index")
    }
    // console.log(req.cookies['Identifier'])
}