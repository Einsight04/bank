const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require('uuid');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);
    const {name, email, password, passwordConfirm} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.log(err);
        }

        if (!name || !email || !password || !passwordConfirm) {
            return res.render("login", {
                message: "Please fill out all fields."
            });
        } else if (results.length > 0) {
            return res.render("register", {
                message: "Email already is use"
            });
        } else if (password !== passwordConfirm) {
            return res.render("register", {
                message: "Passwords do not match."
            });
        }

        let uuid = uuidv4();
        let hashedPassword = await bcrypt.hash(password, 8);

        db.query("INSERT INTO users SET ?", {
            name: name,
            email: email,
            password: hashedPassword,
            uuid: uuid

        }, (err) => {
            if (err) {
                console.log(err);
            }

            res.cookie('UUID', uuid, {maxAge: 900000, httpOnly: true});
            return res.redirect("/accounts/menu")

        })
    });
}