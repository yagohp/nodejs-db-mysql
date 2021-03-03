var mysql = require('mysql');
var migration = require('mysql-migrations');

module.exports = function CustomMigration(host, user, password, database) {
    var connection = mysql.createPool({ connectionLimit: 10, host, user, password, database });
    migration.init(connection, __dirname + '/migrations');
}