const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require("uuid");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    if (!req.cookies["UUID"]) {
        return res.redirect("index")

    }

    res.render("accounts")

    db.query("SELECT checking FROM users WHERE uuid = ?", req.cookies["UUID"], async (err, checkingBalance) => {
        if (err) {
            console.log(err);
        }

        console.log(checkingBalance)
    });


    // console.log(req.cookies['Identifier'])
}