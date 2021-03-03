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

MysqlDB.prototype._returnError = function (error) {
    if (this.debug) {
        DB.prototype.error.call(this, error);
    }

    return false;
};

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

MysqlDB.prototype._exeQuery = function (self, sql, callback) {
    self.dbo.query(sql, function (err, result) {
        if (err) {
            if (self.debug)
                DB.prototype.error.call(self, err);
            callback(err, null);
            return;
        };

        callback(null, result);
    });
};

MysqlDB.prototype.connMigration = function (host, user, password, database) {
    if (!this.migration) {
        CustomMigration.CustomMigration(this.host, this.username, this.password, this.databasename);
        this.migration = true;
    }
};

// TODO: atualizar a conexão nesta classe após criar o db
MysqlDB.prototype.createDB = async function (database) {
    var self = this;
    return await this.exeQuery(self, `CREATE DATABASE ${database};`)
        .then(success => true)
        .catch(err => {
            if (err.message.includes(`ER_DB_CREATE_EXISTS`))
                return true;

            return self._returnError(err)
        });
};

MysqlDB.prototype.dropDB = async function (database) {
    var self = this;

    return await this.exeQuery(self, `DROP DATABASE ${database};`)
        .then(success => true)
        .catch(err => self._returnError(err));
};

MysqlDB.prototype.createTable = async function (table, options) {
    var self = this;
    var sql = `CREATE TABLE IF NOT EXISTS ${table} ${options}`;

    return await this.exeQuery(self, sql)
        .then(success => true)
        .catch(err => self._returnError(err));
};

MysqlDB.prototype.dropTable = async function (table) {
    var self = this;
    var sql = `DROP TABLE IF EXISTS ${table}`;

    return await this.exeQuery(self, sql)
        .then(success => true)
        .catch(err => self._returnError(err));
};

module.exports = MysqlDB;

/*
MysqlDB.prototype.save = function (table, fields, values, callback) {
    var self = this;
    fields = fields.join(', ');
    values = values.join(', ');

    let sql = `INSERT INTO ${table} (${fields}) VALUES (${values})`;
    this.dbo.query(sql, function (err, result) {
        if (err) {
            DB.prototype.error.call(self, err);
            callback(err, null);
            return;
        };

        callback(null, result);
    });
};

MongoDB.prototype.find = function (collection, queryObj, callback) {
    this.dbo.db(this.databasename).collection(collection)
        .find(queryObj.query.where)
        .project(queryObj.query.fields)
        .sort(queryObj.query.$orderby)
        .limit(queryObj.limit - 1 < 0 ? 0 : queryObj.limit - 1)
        .skip(queryObj.skip)
        .toArray(function (error, success) {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, success);
        });
};

MongoDB.prototype.findBy = function (collection, statment, callback) {
    this.dbo.db(this.databasename).collection(collection)
        .findOne(statment, function (error, result) {
            if (error) {
                callback(error, null);
                return;
            }

            if (result == null) {
                callback(new Error(`Registro não encontrado.`), null);
                return;
            }

            callback(null, result);
        });
};

MongoDB.prototype.save = function (collection, obj, callback) {
    this._connect(function (err, success) {
        if (err) {
            callback(err, null);
            return;
        }

        success.db(this.databasename).collection(collection)
            .insertOne(obj, function (err, result) {
                if (err) {
                    callback(err, null)
                }

                var result = result.ops[0];
                result._id = result._id + ``;

                callback(null, result);
            });
    });
}

MongoDB.prototype.update = async function (collection, filter, updateObj, callback) {
    var updateDoc = { $set: updateObj };

    const coll = this.dbo.db(this.databasename).collection(collection);
    const result = await coll.updateOne(filter, updateDoc, { upsert: false });

    if (result.modifiedCount === 1) {
        callback(null, `Registro atualizado com sucesso!`);
    } else {
        callback(new Error(`Registro não encontrado.`), null)
    }
};

MongoDB.prototype.delete = async function (collection, statement, callback) {
    const coll = this.dbo.db(this.databasename).collection(collection);
    let result = await coll.deleteMany(statement);
    if (result.deletedCount > 0) {
        callback(null, `Removido com sucesso!`);
    } else {
        callback(new Error(`Registro já removido.`), null)
    }
};
*/
//CREATE TABLE

//QUER
/*con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});*/


// INSERT
/*con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
});*/


//INSERT BATCH
/*con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO customers (name, address) VALUES ?";
    var values = [
        ['John', 'Highway 71'],
        ['Peter', 'Lowstreet 4'],
        ['Amy', 'Apple st 652'],
        ['Hannah', 'Mountain 21'],
        ['Michael', 'Valley 345'],
        ['Sandy', 'Ocean blvd 2'],
        ['Betty', 'Green Grass 1'],
        ['Richard', 'Sky st 331'],
        ['Susan', 'One way 98'],
        ['Vicky', 'Yellow Garden 2'],
        ['Ben', 'Park Lane 38'],
        ['William', 'Central st 954'],
        ['Chuck', 'Main Road 989'],
        ['Viola', 'Sideway 1633']
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});*/

//result
/*{
    fieldCount: 0,
        affectedRows: 14,
            insertId: 0,
                serverStatus: 2,
                    warningCount: 0,
                        message: '\'Records:14  Duplicated: 0  Warnings: 0',
                            protocol41: true,
                                changedRows: 0
}*/
