#!/usr/bin/env node

/**
 * Module dependencies.
 */

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

var app = require('../app');
var debug = require('debug')('catch:server');
var http = require('http');

if (cluster.isMaster) {
    logger.info('Master ' + process.pid + ' is running');
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
        logger.info('[Worker]' + (i+1) + 'forked');
    }

    cluster.on('exit', function (worker) {
        logger.error('Worker:' + worker.id + ' died and ready to fork new one');
        cluster.fork();
        logger.info('[Worker] new forked');
    });
} else {

    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    logger.info('Worker ' + cluster.worker.id + ' pid:' + process.pid + ' started');
}


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
