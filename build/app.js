"use strict";
const path = require("path");
const express = require("express");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const mysqldb = require("../db-connection/mysql");
const cron = require("node-cron");
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const app = express();
app.use(cookieParser());
const db = mysqldb.sqlDb();
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
// Define Routes
app.use("/", require(path.join(__dirname, "..", "routes/pages.js")));
app.use("/auth", require(path.join(__dirname, "..", "routes/auth")));
app.use("/accounts", require(path.join(__dirname, "..", "routes/accounts")));
app.get('*', (req, res) => {
    return res.render("404");
});
app.listen(4000, () => {
    console.log("Server started on Port 4000");
});
function update() {
    console.log("Updating...");
    db.query("UPDATE users SET time = time + 1", (err, results) => {
        if (err) {
            console.log(err);
        }
    });
}
cron.schedule("* * * * * *", () => {
    update();
});
