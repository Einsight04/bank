"use strict";
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const cron = require("node-cron");
const db = require(path.join(__dirname, "..", "/db-connection/mysql"));
const { Checking, Saving } = require(path.join(__dirname, "..", "/inheritance/inherit"));
console.log(path.join(__dirname, "..", ".env"));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const app = express();
app.use(cookieParser());
const publicDirectory = path.join(__dirname, "..", "public");
app.use(express.static(publicDirectory));
// Allow Parsing of URL-Encoded Bodies / JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "hbs");
db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Database connection successful");
    }
});
// Routes
app.use("/", require(path.join(__dirname, "..", "routes/pages.js")));
app.use("/auth", require(path.join(__dirname, "..", "routes/auth")));
app.use("/accounts", require(path.join(__dirname, "..", "routes/accounts")));
app.get('*', (req, res) => {
    return res.render(path.join(__dirname, "..", "/views/404"));
});
app.listen(2500, () => {
    console.log("Server started on Port 4000");
});
/**
 * Updates mysql db with new balance after interest
 */
function update() {
    const checkingInterest = (new Checking).interestAdded();
    const savingInterest = (new Saving).interestAdded();
    db.query("UPDATE users SET time = time + 1 WHERE time < 5", (err) => {
        if (err) {
            console.log(err);
        }
    });
    db.query(mysql.format(`UPDATE users SET time = 0, checking = checking * ${checkingInterest}, saving = saving * ${savingInterest} WHERE time >= 5`), (err) => {
        if (err) {
            console.log(err);
        }
    });
}
// Interest Update
cron.schedule("* * * * * *", () => {
    update();
});
