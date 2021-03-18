const test = require('tape');
const MysqlDB = require('../mysql');

let dbinstance = new MysqlDB('127.0.0.1', '3306', 'yagohp', 'testedb');
let dbinstance2 = new MysqlDB('127.0.0.2', '3306', 'yagohp2', 'testedb2');

test('Conexão e falha de conexão com banco de dados.', async (t) => {
    t.assert(await dbinstance.connect() === true, "Conexao estabelecida.");
    t.assert(await dbinstance2.connect() === false, "Conexao não estabelecida.");
    t.assert(dbinstance.closeConn() === true, "Fechamento da conexão aberta.");
    t.end()
});

var db = 'saudavelmente_dev';

test('Criar um banco de dados.', async (t) => {
    t.assert(await dbinstance.connect() === true, "Conexao estabelecida.");
    t.assert(await dbinstance.createDB('') === false, "Retornar FALSE no erro de criação de banco de dados.");
    t.assert(await dbinstance.createDB(db) === true, `Banco de dados "${db}" criado.`);
    t.assert(dbinstance.closeConn() === true, "Fechamento da conexão aberta.");
    t.end()
});

let dbInstance3 = new MysqlDB('127.0.0.1', '', 'yagohp', 'testedb', db, true);

test('Criar uma tabela no banco de dados.', async (t) => {
    t.assert(await dbInstance3.connect() === true, "Conexao estabelecida.");
    t.assert(await dbInstance3.createTable('', '()') === false, "Retornar FALSE em caso de erro.");
    let options = '(id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,' +
            'firstname VARCHAR(30) NOT NULL, ' +
            'lastname VARCHAR(30) NOT NULL, ' +
            'email VARCHAR(255), ' +
            'reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)';
    t.assert(await dbInstance3.createTable('test_table', options) === true, "Criação de uma tabela.");
    t.assert(dbInstance3.closeConn() === true, "Fechamento da conexão aberta.");
    t.end()
});

test('Insere e consulta um registro em uma tabela no banco de dados.', async (t) => {
    t.assert(await dbInstance3.connect() === true, "Conexao estabelecida.");
    t.assert(await dbInstance3.insert('test_table', [
        "firstname", "lastname", "email"
    ], [
        "Yago Henrique", "Pereira", "teste@teste.com"
    ]) === true, "Registro inserido!");
    t.assert(await dbInstance3.selectBy('test_table', ['*'], 'lastname', 'Pereira') === true, "Registro obtido!");
    t.assert(dbInstance3.closeConn() === true, "Fechamento da conexão aberta.");
    t.end()
});

test('Remover uma tabela no banco de dados.', async (t) => {
    t.assert(await dbInstance3.connect() === true, "Conexao estabelecida.");
    t.assert(await dbInstance3.dropTable('') === false, "Retornar FALSE em caso de erro.");
    t.assert(await dbInstance3.dropTable('test_table') === true, "Remoção de uma tabela do banco de dados.");
    t.assert(dbInstance3.closeConn() === true, "Fechamento da conexão aberta.");
    t.end()
});

test('Deletar um banco de dados.', async (t) => {
    t.assert(await dbinstance.connect() === true, "Conexao estabelecida.");
    t.assert(await dbinstance.dropDB('') === false, `Retornar FALSE no erro de deleção de um banco de dados.`);
    t.assert(await dbinstance.dropDB(db) === true, `Banco de dados "${db}" deletado.`);
    t.assert(dbinstance.closeConn() === true, "Fechamento da conexão aberta.");
    t.end()
});
