var util = require('util');
var Operators = require('./whereOperators');

//TODO: descrever
/**
 * 
 */
function QueryBuilder() {
    this.types = [
        'select', 'update', 'delete'
    ];

    this.orderOptions = ["ASC", "DESC"];
    this._reset();
};

//TODO: descrever
QueryBuilder.prototype._reset = function () {
    this.query = ``;
    this.type = ``;
    this.limit = ``;
    this.whereOptions = ``;
    this.order = [];
};

/**
 * Executa a operação SELECT em uma TABLE no banco de dados.
 * @param {Array} tables tabelas que serão consultadas
 * @param {Array} fields array com os campos que serão obtidos na consulta. Um campo
 * também pode ser informado no formato tablename.fieldname
 */
QueryBuilder.prototype.select = function (tables, fields) {
    this._reset();
    this.query = `SELECT ${fields.join(", ")} FROM ${tables.join(", ")}`;
    this.type = `select`;
    return this;
};

QueryBuilder.prototype.update = function (table, columns, values) {
    this._reset();
    let len = columns.length;
    if (len != values.length) {
        throw new Error(`A quantia de colunas e valores não são iguais.`);
    }

    let set = [];
    for (var i = 0; i < len; i++) {
        set.push(`${columns[i]} = ${values[i]}`);
    }

    this.query = `UPDATE ${table} SET ${set.join(", ")}`;
    this.type = `update`;
    return this;
};

QueryBuilder.prototype.delete = function (table) {
    this._reset();
    this.query = `DELETE FROM ${table}`;
    this.type = `delete`;
    return this;
};

//TODO: descrever
QueryBuilder.prototype.setLimit = function (start, offset) {
    if (this.type != `select`) {
        throw new Error(`LIMIT só pode ser utilizado na operação SELECT.`);
    }

    this.limit = `LIMIT ${start} OFFSET ${offset}`;
    return this;
};

/**
 * Adiciona condição WHERE na query
 * @param {String} field - coluna da tabela para a pesquisa
 * @param {*} value - valor para a pesquisa
 * @param {String} operator  - operador contido em Operators
 * @returns ínidice atual
 */
QueryBuilder.prototype.where = function (whereObj, nested = false) {
    try {
        var self = this;
        whereObj = JSON.parse(JSON.stringify(whereObj));

        let keysLen = Object.keys(whereObj).length;

        if (keysLen <= 0) {
            throw new Error(`Insira uma cláusula where.`)
        }

        let sqlArr = [];
        Object.keys(whereObj).map((key) => {
            let current = whereObj[key];
            if (key == `where`) {
                sqlArr.push(`${current.field} ${Operators[current.op]} ${current.val}`);
            } else {
                sqlArr.push(_parseWhereObject(current, key))
            }
        });

        this.whereOptions = `${sqlArr.join(' AND ')}`;

        return this;
    } catch (error) {
        throw error;
    }
};

function _parseWhereObject(obj, andOr) {
    let currNode = [];

    if (Array.isArray(obj)) {

        let len = obj.length;

        for (var i = 0; i < len; i++) {
            currNode.push(_parseWhereObject(obj[i], andOr));
        }

        return `( ${currNode.join(` ${andOr.toUpperCase()} `)} )`;
    } else {
        let keys = Object.keys(obj);
        let key = null;

        if (keys.includes('or'))
            key = `or`;

        if (keys.includes('and'))
            key = `and`;

        if (key != null) {
            currNode.push(_parseWhereObject(obj[key], key));
            return ` ${currNode.join(` ${key.toUpperCase()} `)} `;
        }

        if (obj.op == Operators.IN || obj.op == `NIN`) {
            return ` ${obj.field} ${Operators[obj.op]} (${obj.val.join(', ')}) `;
        }

        return `${obj.field} ${Operators[obj.op]} ${obj.val}`;
    }
};

QueryBuilder.prototype._checkOperator = function (operator) {
    if (!(Object.values(Operators).includes(operator))) {
        throw new Error(`Operador inválido! Operadores permitidos: ${Object.values(Operators)}`);
    }
};

/**
 * Adiciona uma condição BETWEEN na cláusula WHERE
 * @param {String} field - coluna da tabela para a pesquisa
 * @param {*} valueStart - primeiro valor da consulta BETWEEN
 * @param {*} valueEnd  - segundo valor da consulta BETWEEN
 */
QueryBuilder.prototype.whereBetween = function (field, valueStart, valueEnd) {
    if (this.type != `select`) {
        throw new Error(`BETWEEN só pode ser utilizado na operação SELECT.`);
    }

    this.whereOptions.push(`${field} BETWEEN ${valueStart} AND ${valueEnd}`);
};

//TODO: descrever
QueryBuilder.prototype.orderBy = function (field, orderValue = `ASC`) {
    if (!this.orderOptions.includes(orderValue)) {
        throw new Error(`O valor ${orderOptions} não é permitido. Valores permitidos: ${this.orderOptions.join(", ")}`);
    }

    if (this.type != `select`) {
        throw new Error(`ORDER só pode ser utilizado na operação SELECT.`);
    }

    this.order.push(`${field} ${orderValue}`);
};

//TODO: descrever
QueryBuilder.prototype.getQuery = function () {
    let sql = this.query;

    if (this.whereOptions.length > 0) {
        sql = `${sql} WHERE ${this.whereOptions}`;
    }

    if (this.order.length > 0) {
        sql = `${sql} ORDER BY ${this.order.join(', ')}`;
    }

    if (this.limit != ``) {
        sql = `${sql} ${this.limit}`;
    }

    this._reset();
    return `${sql};`;
};

module.exports = QueryBuilder;