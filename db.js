var Logger = require('./utils/logger');

function DB(host, port, username, password, database = '', debug = false) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.database = database;
    this.debug = debug;
};

DB.prototype.connect = function (callback) {
    throw new Error('A função connect() precisa ser implementada.');
};

DB.prototype.closeConn = function () {
    throw new Error('A função closeConn() precisa ser implementada.');
};

/**
 * Escreve uma mensagem em um arquivo ./temp/stdout.log
 * @param {String} message  mensagem que será escrita
 */
DB.prototype.log = function (message) {
    Logger.debug(message);
};

/**
 * Escreve uma mensagem em um arquivo ./temp/stdout.log
 * @param {String} message  mensagem que será escrita
 */
DB.prototype.info = function (message) {
    Logger.info(message);
};

/**
 * Escreve erros no arquivo ./temp/stderr.log
 * @param {Error} error instância de Error com nome, mensagem e stacktrace
 */
DB.prototype.error = function (error) {
    Logger.error(error);
};

DB.prototype._find = function (queryObj, callback) {
    throw new Error('A função find() precisa ser implementada');
};

DB.prototype._findBy = function (queryObj, callback) {
    throw new Error('A função findBy() precisa ser implementada');
};

DB.prototype._save = function (queryObj, callback) {
    throw new Error('save() must be implemented');
};

DB.prototype._update = function (collections, filter, updateObj, callback) {
    throw new Error('update() must be implemented');
};

DB.prototype._delete = function (collection, statement, callback) {
    throw new Error('delete() must be implemented');
};

module.exports = DB;
