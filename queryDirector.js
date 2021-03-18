var util = require('util');
var Operators = require('./whereOperators');
var QueryBuilder = require('./queryBuilder');

const fs = require('fs');

function QueryDirector() {
    let rawdata = fs.readFileSync('query.json');
    this.whereCl = JSON.parse(rawdata);
};

QueryDirector.prototype.findOne = function () {
    let sql = new QueryBuilder()
        .select([`users`], [`id, name, email`])
        .where(this.whereCl)
        .setLimit(1, 1)
        .getQuery();

    console.log(sql)
};

module.exports = QueryDirector;