var DBDirector = require('./dbDirector');
var MysqlDB = require('./mysql');

let dbdir = DBDirector(new MysqlDB('127.0.0.1', '', 'yagohp', 'testedb', 'saudavelmente_dev', true));

async function doTheThing(){
    /*await dbdir.insert('test_table', {
        firstname: "Diego",
        lastname: "Diga",
        email: "diga@digamais.com"
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error.message);
    });*/

    /*await dbdir.update('test_table', {
        firstname: "Diego",
        lastname: "Diga Diga",
        email: "digadiga@digamais.com"
    }, 'lastname', 'Diga').then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error.message);
    });*/

    let mock = [
        {
            firstname: "teste1",
            lastname: "teste1 teste",
            email: "teste@teste1.com"
        },
        {
            firstname: "teste2",
            lastname: "teste2 teste",
            email: "teste@teste2.com"
        },
        {
            firstname: "teste3",
            lastname: "teste3 teste",
            email: "teste@teste3.com"
        }
    ];

    await dbdir.insertBatch('test_table', mock).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error.message);
    });

    dbdir.find(
        'test_table', ["firstname", "lastname"], {}, 8, 1, ["firstname"], ["ASC"]
    )
        .then(result => {
            console.log(result);

            dbdir.findBy('test_table', ['firstname', 'lastname', 'email'], "lastname", "Rosim 1")
                .then(result => {
                    console.log(result);
                })
                .catch(error => {
                    console.log(error.message);
                });
        })
        .catch(error => {
            console.log(error.message);
        })

    
}

doTheThing();