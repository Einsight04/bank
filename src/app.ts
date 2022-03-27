const path = require("path")
const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, "..", "public");
app.use(express.static(publicDirectory));

// Allow Parsing of URL-Encoded Bodies
app.use(express.urlencoded({ extended: false }));
// Allow Parsing of JSON Bodies
app.use(express.json());

app.set("view engine", "hbs");

db.connect( (err: any) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connection successful");
    }
})


// Define Routes
app.use("/", require(path.join(__dirname, "..", "routes/pages.js")))
app.use('/auth', require('../routes/auth'))


app.listen(4000, () => {
    console.log("Server started on Port 4000");
})