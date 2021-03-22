var DBDirector = require('./dbDirector');
var MysqlDB = require('./mysql');

module.exports = function (hostname, port, username, password, database, log = false) {
    return DBDirector(new MysqlDB(hostname, port, username, password, database, log));
};