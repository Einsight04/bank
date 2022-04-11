const mysql = require("mysql");
const path = require("path")
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

module.exports = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
})