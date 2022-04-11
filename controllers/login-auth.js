const path = require("path")
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require("uuid");
const db = require('../db-connection/mysql')

exports.register = (req, res) => {
    const {email, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.log(err);
        }

        if (!email || !password) {
            return res.render(path.join(__dirname, "..", "/views/login"), {
                error: "Please fill out all fields."
            });
        } else if (!results.length) {
            return res.render(path.join(__dirname, "..", "/views/login"), {
                error: "Email is not in use"
            });
        } else if (!await bcrypt.compare(password, results[0].password)) {
            return res.render(path.join(__dirname, "..", "/views/login"), {
                error: "Email and or password is incorrect"
            });
        }

        let uuid = uuidv4()

        db.query(mysql.format(`UPDATE users SET uuid = "${uuid}" WHERE id = "${results[0].id}"`), (err) => {
            if (err) {
                console.log(err);
            }
        });

        res.cookie('UUID', uuid, {maxAge: 900000, httpOnly: true});
        return res.redirect("/accounts/menu")
    });
}