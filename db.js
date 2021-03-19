var Logger = require('./utils/logger');

function DB(host, port, username, password, database = '', debug = false) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.database = database;
    this.debug = debug;
};

DB.prototype.connect = async function () {
    throw new Error('A função connect() precisa ser implementada.');
};

DB.prototype.closeConn = function () {
    throw new Error('A função closeConn() precisa ser implementada.');
};

/**
 * Escreve uma mensagem em um arquivo ../db_logs/stdout.log
 * @param {String} message  mensagem que será escrita
 */
DB.prototype.log = function (message) {
    Logger.debug(message);
};

/**
 * Escreve uma mensagem em um arquivo ../db_logs/stdout.log
 * @param {String} message  mensagem que será escrita
 */
DB.prototype.info = function (message) {
    Logger.info(message);
};

/**
 * Escreve erros no arquivo ../db_logs/stderr.log
 * @param {Error} error instância de Error com nome, mensagem e stacktrace
 */
DB.prototype.error = function (error) {
    Logger.error(error);
};

DB.prototype.createDB = function (database) {
    throw new Error('A função createDB() precisa ser implementada');
};

DB.prototype.dropDB = function (database) {
    throw new Error('A função dropDB() precisa ser implementada');
};

DB.prototype.createTable = function (table, options) {
    throw new Error('A função createTable() precisa ser implementada');
};

DB.prototype.dropTable = function (table) {
    throw new Error('A função dropDB() precisa ser implementada');
};

DB.prototype.insert = function (table, fields, values) {
    throw new Error('A função insert() precisa ser implementada');
};

DB.prototype.insertBatch = function (table, fields, values) {
    throw new Error('A função insertBatch() precisa ser implementada');
};

DB.prototype.selectBy = function (table, fields, whereField, whereValue) {
    throw new Error('A função selectBy() precisa ser implementada');
};

DB.prototype.selectAll = function (table, fields, limit, page, orderByField, orderBy) {
    throw new Error('A função selectAll() precisa ser implementada');
};

DB.prototype.count = function (table, countExpression) {
    throw new Error('A função count() precisa ser implementada');
};

DB.prototype.update = function (table, fields, values, whereField, whereValue) {
    throw new Error('A função update() precisa ser implementada');
};

module.exports = DB;
