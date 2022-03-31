const mysqldb = require("../db-connection/mysql");

const db = mysqldb.sqlDb()

module.exports = {
    update: function () {
        console.log('Running cron job')




        db.query("UPDATE users SET name = 'fix' WHERE id = 17", async (err, results) => {
            if (err) {
                console.log(err);
            }

            console.log(results)


        });
    }
}