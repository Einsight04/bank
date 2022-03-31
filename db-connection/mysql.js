const mysql = require("mysql");

module.exports = {
    sqlDb: function () {
        return mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE
        });
    }
}