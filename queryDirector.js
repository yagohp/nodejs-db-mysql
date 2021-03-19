var util = require('util');
var Operators = require('./whereOperators');
var QueryBuilder = require('./queryBuilder');
const MysqlDB = require('./mysql');

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

QueryDirector.prototype.insertBatch = async function () {
    let mock = [
        {
            firstname: "Leonardo",
            lastname: "Rosim",
            email: "leonardo@gmail.com",
            reg_date: '2021-03-18 17:53:11'
        }, {
            firstname: "Fabio",
            lastname: "Gonçalves",
            email: "fabiogon@gmail.com",
            reg_date: '2021-03-18 17:53:11'
        }, {
            firstname: "Alisson",
            lastname: "Menardi",
            email: "almenardi@gmail.com",
            reg_date: '2021-03-18 17:53:11'
        }, {
            firstname: "Hélio",
            lastname: "Figueira",
            email: "helifigs@gmail.com",
            reg_date: '2021-03-18 17:53:11'
        }
    ];

    let mysqlInstance = new MysqlDB('127.0.0.1', '', 'yagohp', 'testedb', 'saudavelmente_dev', true);

    var vls = []
    mock.forEach(element => {
        vls.push(Object.values(element));
    });

    await mysqlInstance.connect();
    let res = await mysqlInstance.insertBatch('test_table', ['firstname', 'lastname', 'email', 'reg_date'], vls);
    console.log(res);
    mysqlInstance.closeConn();
};

QueryDirector.prototype.select = async function(){
    let mysqlInstance = new MysqlDB('127.0.0.1', '', 'yagohp', 'testedb', 'saudavelmente_dev', true);
    await mysqlInstance.connect();
    let res = await mysqlInstance.selectAll('test_table', ['*'], 2, 7, "name", "ASC");
    console.log(res);
    mysqlInstance.closeConn();
};

QueryDirector.prototype.count = async function(){
    let mysqlInstance = new MysqlDB('127.0.0.1', '', 'yagohp', 'testedb', 'saudavelmente_dev', true);
    await mysqlInstance.connect();
    let res = await mysqlInstance.count('test_table', '*');
    mysqlInstance.closeConn();
};

QueryDirector.prototype.update = async function(){
    let mysqlInstance = new MysqlDB('127.0.0.1', '', 'yagohp', 'testedb', 'saudavelmente_dev', true);
    await mysqlInstance.connect();
    let res = await mysqlInstance.update('test_table', ["firstname", "lastname"], ["Yago", "Pereira2"], 
        "firstname", "Yago Henrique");
    console.log(res);
    mysqlInstance.closeConn();
}

module.exports = QueryDirector;