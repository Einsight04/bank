const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require('uuid');
const db = require('../db-connection/mysql')

exports.register = (req, res) => {
    const {name, email, password, passwordConfirm} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.log(err);
        }

        if (!name || !email || !password || !passwordConfirm) {
            return res.render("register", {
                error: "Please fill out all fields."
            });
        } else if (results.length > 0) {
            return res.render("register", {
                error: "Email already is use"
            });
        } else if (password !== passwordConfirm) {
            return res.render("register", {
                error: "Passwords do not match."
            });
        } else if (!password.match(/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/gm)) {
            let errorMessage = ""

            if (!password.match((/(?=^.{8,}$).*$/gm))) {
                errorMessage += "Password must be 8 characters in length<br>"
            }
            if (!password.match((/.*[A-Z].*/gm))) {
                errorMessage += "Password must include an uppercase character<br>"
            }
            if (!password.match(/(.*[a-z].*)/gm)) {
                errorMessage += "Password must include a lowercase character<br>"
            }
            if (!password.match(/(?=.*\d)/gm)) {
                errorMessage += "Password must include a digit<br>"
            }
            if (!password.match(/(?=.*\W)/gm)) {
                errorMessage += "Password must include a special character<br>"
            }

            return res.render("register", {
                error: errorMessage
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