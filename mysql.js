var mysql = require('mysql');
var DB = require('./db');
var util = require('util');
var promisification = require('./utils/promisification');
var CustomMigration = require('./utils/migration');

function MysqlDB(hostname, port, username, password, databasename = '', debug = false) {
    this.username = username;
    this.password = password;
    this.host = hostname;
    this.port = port;
    this.databasename = databasename;
    this.debug = debug;
    this.exeQuery = promisification.promisify(this._exeQuery);
    this.migration = false;
};

util.inherits(MysqlDB, DB);

/**
 * Função privada para formatar capturar erros e tratar o retorno
 * deste arquivo.
 * @param {Error} error - exception disparado
 * @returns - boolean com o valor false (sempre)
 */
MysqlDB.prototype._returnError = function (error) {
    if (this.debug) {
        DB.prototype.error.call(this, error);
    }

    return false;
};

/**
 * Cria uma conexão com o banco de dados informado no construtor
 * @returns boolean indicando o sucesso da operação
 */
MysqlDB.prototype.connect = async function () {
    var self = this;

    let connParams = {
        host: this.host, user: this.username, password: this.password
    };

    if (this.databasename != '')
        connParams.database = this.databasename;

    self.dbo = mysql.createConnection(connParams);

    let conn = new Promise(function (resolve, reject) {
        self.dbo.connect(function (err) {
            if (err) {
                reject(err);
            };

            resolve(self.dbo);
        });
    });

    return await conn.then(res => true).catch(err => {
        if (self.debug)
            DB.prototype.error.call(self, err);
        return false;
    });
};

/**
 * Fecha a conexão atual com o banco de dados
 * @returns boolean indicando o sucesso da operação
 */
MysqlDB.prototype.closeConn = function () {
    try {
        this.dbo.end();
        return true;
    } catch (error) {
        if (this.debug)
            DB.prototype.error.call(this, error);

        return false;
    }
};

/**
 * Função privada que executa as queries a fim de reaproveitar código e reduzir
 * o tamanho deste arquivo.
 * @param {MysqlDB} self - instância de MysqlDB (this)
 * @param {string} sql - Query SQL que será executada
 * @param {array} vals - valores de bulk insert, informar null caso não for utilizar
 * @param {function} callback - callback para retornar o resultado da operação
 */
MysqlDB.prototype._exeQuery = function (self, sql, vals = null, callback) {
    if (vals != null) {
        self.dbo.query(sql, [vals], function (err, result) {
            if (err) {
                if (self.debug)
                    DB.prototype.error.call(self, err);
                callback(err, null);
                return;
            };

            callback(null, result);
        });
    } else {
        self.dbo.query(sql, function (err, result) {
            if (err) {
                if (self.debug)
                    DB.prototype.error.call(self, err);
                callback(err, null);
                return;
            };

            callback(null, result);
        });
    }

};

//TODO: implementar
MysqlDB.prototype.connMigration = function (host, user, password, database) {
    if (!this.migration) {
        CustomMigration.CustomMigration(this.host, this.username, this.password, this.databasename);
        this.migration = true;
    }
};

/**
 * Cria um banco de dados
 * @param {string} database - nome do banco de dados que será criado
 * @returns boolean indicando o sucesso da operação
 */
MysqlDB.prototype.createDB = async function (database) {
    var self = this;
    return await this.exeQuery(self, `CREATE DATABASE ${database};`, null)
        .then(success => true)
        .catch(err => {
            if (err.message.includes(`ER_DB_CREATE_EXISTS`))
                return true;

            return self._returnError(err)
        });
};

/**
 * Exclui um banco de dados
 * @param {string} database - nome do banco de dados que será excluído
 * @returns boolean indicando o sucesso da operação
 */
MysqlDB.prototype.dropDB = async function (database) {
    var self = this;

    return await this.exeQuery(self, `DROP DATABASE ${database};`, null)
        .then(success => true)
        .catch(err => self._returnError(err));
};

/**
 * Cria uma tabela no banco de dados
 * @param {string} table - nome da tabela que será criada
 * @param {string} options - string com os detalhes da tabela que será criada 
 * @returns boolean indicando o sucesso da operação
 */
MysqlDB.prototype.createTable = async function (table, options) {
    var self = this;
    var sql = `CREATE TABLE IF NOT EXISTS ${table} ${options}`;

    return await this.exeQuery(self, sql, null)
        .then(success => true)
        .catch(err => self._returnError(err));
};

/**
 * Remove uma tabela do banco de dados
 * @param {string} table - nome da tabela que será removida
 * @returns boolean indicando o sucesso da operação
 */
MysqlDB.prototype.dropTable = async function (table) {
    var self = this;
    var sql = `DROP TABLE IF EXISTS ${table}`;

    return await this.exeQuery(self, sql, null)
        .then(success => true)
        .catch(err => self._returnError(err));
};

/**
 * Inserir um registro no banco de dados
 * @param {string} table - nome da tabela em que o registro será inserido
 * @param {array} fields - array de strings com as colunas da tabela
 * @param {array} values - array de strings com os valores do registro que será inserido
 * @returns boolean do sucesso da operação
 */
MysqlDB.prototype.insert = async function (table, fields, values) {
    var self = this;
    fields = fields.join(', ');
    values = '"' + values.join('", "') + '"';

    let sql = `INSERT INTO ${table} (${fields}) VALUES (${values});`;

    return await this.exeQuery(self, sql, null)
        .then(success => true)
        .catch(err => self._returnError(err));
};

/**
 * Insere um lote de registros no banco de dados
 * @param {string} table - tabela em que os registros serão inseridos
 * @param {array} fields - array de strings com os campos, ex: ['first', 'second']
 * @param {array} values - array de strings com os valores dos campos, ex: [['Leonardo', 'Rosim'], [...]].
 * @returns {Int} com o total de registros inseridos
 */
MysqlDB.prototype.insertBatch = async function (table, fields, values) {
    var self = this;
    fields = fields.join(', ');

    let sql = `INSERT INTO ${table} (${fields}) VALUES ?`;

    return await this.exeQuery(self, sql, values)
        .then(success => success.affectedRows)
        .catch(err => self._returnError(err));
};

/**
 * Busca um registro de uma tabela de acordo com um campo específico
 * @param {string} table - tabela que será consultada
 * @param {array} fields - campos desejados
 * @param {string} whereField - campo para a filtragem
 * @param {string} whereValue - valor para a filtragem
 * @returns Object do primeiro registro encontrado
 */
MysqlDB.prototype.findBy = async function (table, fields, whereField, whereValue) {
    var self = this;
    fields = fields.join(', ');

    let sql = `SELECT ${fields} FROM ${table} WHERE ${whereField} = '${whereValue}';`;

    return await this.exeQuery(self, sql, null)
        .then(success => {
            let result = JSON.parse(JSON.stringify(success));
            return result[0];
        })
        .catch(err => self._returnError(err));
};

/**
 * Consulta todos os registros de uma tabela
 * @param {string} table - tabela que será consultada
 * @param {array} fields - campos que serão retornados
 * @param {object} statement - filtro para a consulta, ex: { firstname: "Leonardo", lastname: "Rosim" }
 * @param {int} limit - quantia de itens por páginas
 * @param {int} page - página desejada
 * @param {array} sortFields - campos para ordenação
 * @param {string} sortOrders - ordenação ASC ou DESC para cada campo de sortFields
 * @returns array de objects de registros paginados
 */
MysqlDB.prototype.find = async function (table, fields, statement, limit, page, sortFields, sortOrders) {
    var self = this;
    fields = fields.join(', ');

    page = page * limit - limit

    if (page <= 0)
        page = 0

    let orders = [];
    var len = sortFields.length;
    try {
        for (var i = 0; i < len; i++) {
            orders.push(`${sortFields[i]} ${sortOrders[i]}`);
        }
    } catch (ex) {
        return self._returnError(new Error(`Campos e valores não correspondem.`));
    }

    let whereArr = [];
    if(Object.keys(statement).length > 0){
        Object.keys(statement).map((key) => {
            let current = statement[key];
            whereArr.push(`${key}='${current}'`)
        });
    
        statement = `${whereArr.join(' AND ')}`;;
    }

    let sql = `SELECT ${fields} FROM ${table}`;

    if(whereArr.length > 0){
        sql += ` WHERE ${statement}`;
    }

    if (orders.length > 0) {
        sql += ` ORDER BY ${orders.join(', ')}`;
    }
    sql += ` LIMIT ${limit} OFFSET ${page}`;

    return await this.exeQuery(self, sql, null)
        .then(success => {
            let result = JSON.parse(JSON.stringify(success));
            return result;
        })
        .catch(err => self._returnError(err));
};

/**
 * Conta os registros de uma tabela segundo uma expressão
 * @param {string} table - tabela que será consultada
 * @param {string} countExpression - expressão para o operador COUNT(*)
 * @returns Int com o total de itens encontrados
 */
MysqlDB.prototype.count = async function (table, countExpression) {
    var self = this;

    let sql = `SELECT COUNT(${countExpression}) ItemsCount FROM ${table}`;

    return await this.exeQuery(self, sql, null)
        .then(success => {
            let result = JSON.parse(JSON.stringify(success));
            return result[0].ItemsCount;
        })
        .catch(err => self._returnError(err));
};

/**
 * Atualiza registros no banco de dados que condizem com a operação where
 * @param {string} table - nome da tabela em que o registro será atualizado 
 * @param {array} fields - array de strings com os campos que serão atualizados
 * @param {array} values - array de strings com os valores que serão atualizados
 * @param {string} whereField - campos de condição para a atualização
 * @param {string} whereValue - valor do campo da condição para a atualização
 * @returns {int} indicando quantos registros foram atualizados
 */
MysqlDB.prototype.update = async function (table, fields, values, whereField, whereValue) {
    var self = this;
    var set = [];
    var len = values.length;
    try {
        for (var i = 0; i < len; i++) {
            set.push(`${fields[i]}='${values[i]}'`);
        }
    } catch (ex) {
        return self._returnError(new Error(`Campos e valores não correspondem.`));
    }

    let sql = `UPDATE ${table} SET ${set.join(", ")} WHERE ${whereField} = '${whereValue}'`;
    return await this.exeQuery(self, sql, null)
        .then(success => success.affectedRows)
        .catch(err => self._returnError(err));
};

module.exports = MysqlDB;