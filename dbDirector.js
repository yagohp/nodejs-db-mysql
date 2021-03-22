const MysqlDB = require('./mysql');

/**
 * DBDirector atua como decorator da class MysqlDB
 * @param {MysqlDB} db - instância de MysqlDB
 * @returns {DBDirector} instância de DBDirector para ser utilizado como proxy de MysqlDB
 */
module.exports = function createDBDirector(dbInstance) {

    var proto = Object.getPrototypeOf(dbInstance);

    function DBDirector(dbInstance) {
        this.db = dbInstance;
        this.connErrorMsg = `Não foi possível abrir uma conexão com o banco de dados.`;
    }

    DBDirector.prototype = Object.create(proto);

    /**
     * Função utilizadas para consultas simples. Aceita apenas o operador AND para WHERE
     * @param {string} table - nome da tabela que será feita a consulta
     * @param {array} - array de strings com os campos desejados
     * @param {object} statement - objeto com os campos e valores para filtro, ex: { id: 5, name: "Teste" }
     * @param {int} limit - limite de registros por página
     * @param {int} page - página desejada
     * @param {array} sortFields - array de strings com os campos que serão utilizados no SORT
     * @param {array} sortOrders - array de strings com as ordens para os campos que serão utilizados no SORT (ASC ou DESC)
     */
    DBDirector.prototype.find = function (table, fields, statement, limit = 10, page = 1, sortFields = [], sortOrders = []) {
        var self = this;
        return new Promise(async (resolve, reject) => {
            if (sortFields.length != sortOrders.length) {
                reject(new Error(`Os campos sortFields e sortOrders precisam ter o mesmo tamanho.`));
            }

            if (fields.length == 0) {
                fields = ['*'];
            }

            let conn = await self.db.connect();
            if (!conn) {
                reject(new Error(self.connErrorMsg));
            }

            let res = await self.db.find(table, fields, statement, limit, page, sortFields, sortOrders);
            self.db.closeConn();
            resolve(res);
        });
    };

    /**
     * Busca um registro de uma tabela de acordo com um campo específico
     * @param {string} table - tabela que será consultada
     * @param {array} fields - campos desejados
     * @param {string} whereField - campo para a filtragem
     * @param {string} whereValue - valor para a filtragem
     * @returns Object do primeiro registro encontrado
     */
    DBDirector.prototype.findBy = function (table, fields, whereField, whereValue) {
        var self = this;

        if(fields.length == 0){
            fields = ['*'];
        }

        return new Promise(async (resolve, reject) => {
            let conn = await self.db.connect();
            if (!conn) {
                reject(new Error(self.connErrorMsg));
            }

            let res = await self.db.findBy(table, fields, whereField, whereValue);
            self.db.closeConn();
            resolve(res);
        });
    };

    /**
     * Inserir um registro no banco de dados
     * @param {string} table - nome da tabela em que o registro será inserido
     * @param {object} obj - objeto que será inserido na tabela do banco. Ex: { firstname: "Leonardo" }
     * @returns boolean do sucesso da operação
     */
    DBDirector.prototype.insert = function (table, obj) {
        var self = this;

        var fields = Object.keys(obj);
        var vals = Object.values(obj);

        return new Promise(async (resolve, reject) => {
            let conn = await self.db.connect();
            if (!conn) {
                reject(new Error(self.connErrorMsg));
            }

            let res = await self.db.insert(table, fields, vals);
            self.db.closeConn();
            resolve(res);
        });
    };

    /**
     * Atualiza os registros do banco que atenderem a condição especificada 
     * em whereField e whereValue
     * @param {string} table - tabela que será atualizada
     * @param {object} obj - objeto com os campos que serão atualizados
     * @param {string} whereField - nome do campo da condição do UPDATE 
     * @param {*} whereValue - valor para condição UPDATE
     * @returns {int} - número de registros atualizados
     */
    DBDirector.prototype.update = function (table, obj, whereField, whereValue) {
        var self = this;
        var fields = Object.keys(obj);
        var values = Object.values(obj);

        return new Promise(async (resolve, reject) => {
            let conn = await self.db.connect();
            if (!conn) {
                reject(new Error(self.connErrorMsg));
            }

            let res = await self.db.update(table, fields, values, whereField, whereValue);
            self.db.closeConn();
            resolve(res);
        });
    };

    /**
     * Insere um lote de registros no banco de dados
     * @param {string} table - nome da tabela em que o registro será inserido
     * @param {array} objects - lista de objetos que serão inseridos
     * @returns {int} quantia de registros inseridos
     */
     DBDirector.prototype.insertBatch = function (table, objects) {
        var self = this;

        if(objects.length == 0){
            throw new Error(`Informe pelo menos um registro para a inserção em lote.`);
        }

        var fields = Object.keys(objects[0]);
        var vals = [];

        objects.forEach(element => {
            vals.push(Object.values(element));
        });

        return new Promise(async (resolve, reject) => {
            let conn = await self.db.connect();
            if (!conn) {
                reject(new Error(self.connErrorMsg));
            }

            let res = await self.db.insertBatch(table, fields, vals);
            self.db.closeConn();
            resolve(res);
        });
    };
    
    /*
    DBProxy.prototype.delete = function (collection, statement) {
        var manager = this.dbManager;
        
        return new Promise((resolve, reject) => {
            manager._connect(function (connError, client) {
                if (connError) {
                    reject(connError);
                    return;
                }
    
                manager.delete(collection, statement, function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }
    
                        manager._closeConnection(client);
                        resolve(result);
                    })
            });
        });
    };*/

    return new DBDirector(dbInstance);
};


/*
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

module.exports = QueryDirector;*/