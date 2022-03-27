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
    const {email, password} = req.body;

    db.query("SELECT password FROM users WHERE email = ?", [email], async (err, passwordResult) => {
        if (err) {
            console.log(err);
        }

        if (!passwordResult.length) {
            return res.render("login", {
                message: "Email is not in use"
            });
        } else if (!await bcrypt.compare(password, passwordResult[0].password)) {
            return res.render("login", {
                message: "Email and or password is incorrect"
            });
        } else {
            return res.render("accounts")
        }
    });
}


// if (await bcrypt.compare(password, hashedPassword)) {
//     //Here i am comparing
//     console.log('valid');
// } else {
//     console.log('invalid');
// }