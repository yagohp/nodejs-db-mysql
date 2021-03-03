var fs = require('fs');
var { Console } = require('console');

function Logger() {
    let dir = '../db_logs';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    this.console = new Console({
        stdout: fs.createWriteStream(`${dir}/stdout.log`, { flags: 'a' }), 
        stderr: fs.createWriteStream(`${dir}/stderr.log`, { flags: 'a' })
    });
};

Logger.prototype.info = function (sender, message) {
    var message = `INFO [${new Date().toISOString()}] ${sender.constructor.name}\n${message}`;
    this.console.log(message);
};

Logger.prototype.debug = function (msg) {
    var message = '[DEBUG]' + '[' + new Date().toISOString() + "] : " + msg + "\n";
    this.console.log(message);
};

Logger.prototype.error = function (error) {
    let date = new Date().toISOString();
    let writeError = {
        date: `[${date}]`,
        message: error.message || 'error',
        stack: error.stack || 'Stack indisponível',
        name: `[${error.name}]` || '[nome não identificado]'
    };

    let message = `${writeError.date} ${writeError.name}, Message: ${writeError.message}`;
    message += `\n>>>>${writeError.stack}`;

    this.console.error(message);
};

module.exports = new Logger();