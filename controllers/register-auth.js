const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.log(err);
        }

        if (results.length > 0) {
            return res.render("register", {
                message: "Email already is use"
            });
        } else if (password !== passwordConfirm) {
            return res.render("register", {
                message: "Passwords do not match."
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query("INSERT INTO users SET ?", {
            name: name,
            email: email,
            password: hashedPassword,
        }, (err) => {
            if (err) {
                console.log(err);
            } else {
                let uuid = uuidv4();

                let sql = mysql.format(`UPDATE users SET uuid = "${uuid}" WHERE id = ?`, results[0].id);

                db.query(sql, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

                res.cookie('UUID', uuid, { maxAge: 900000, httpOnly: true });
                return res.redirect("accounts")
            }
        })
    });
}