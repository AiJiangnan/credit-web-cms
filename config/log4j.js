const log4jconfig = {
    appenders: {
        console: {type: 'console'},
        file: {
            type: 'dateFile',
            filename: 'log/debug',
            pattern: '.yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {default: {appenders: ['console', 'file'], level: 'debug'}}
};

module.exports = log4jconfig;