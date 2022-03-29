const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require("uuid");
const mysqldb = require("../db-connection/mysql");

exports.register = (req, res) => {
    const db = mysqldb.sqlDb()

    console.log(req.body);
    const {email, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.log(err);
        }

        console.log(results)

        if (!email || !password) {
            return res.render("login", {
                message: "Please fill out all fields."
            });
        } else if (!results.length) {
            return res.render("login", {
                message: "Email is not in use"
            });
        } else if (!await bcrypt.compare(password, results[0].password)) {
            return res.render("login", {
                message: "Email and or password is incorrect"
            });
        }

        let uuid = uuidv4()

        let sql = mysql.format(`UPDATE users SET uuid = "${uuid}" WHERE id = ?`, results[0].id);

        db.query(sql, (err) => {
            if (err) {
                console.log(err);
            }
        });

        res.cookie('UUID', uuid, {maxAge: 900000, httpOnly: true});
        return res.redirect("/accounts/menu")
    });
}