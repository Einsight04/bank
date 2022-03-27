const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;

    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, emailResult) => {
        if (err) {
            console.log(err);
        }

        if (emailResult.length > 0) {
            return res.render("register", {
                message: "Email already is use"
            });
        } else if (password !== passwordConfirm) {
            return res.render("register", {
                message: "Passwords do not match."
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query("INSERT INTO users SET ?", {
            name: name,
            email: email,
            password: hashedPassword,
        }, (err) => {
            if (err) {
                console.log(err)
            } else {
                return res.render("accounts")
            }
        })
    });
}