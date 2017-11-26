'use strict';

var winston = require('winston');
var expressWinston = require('express-winston');
var moment = require('moment');


/////////////////////////////////////////////////// PRIVATE METHODS ///////////////////////////////////////////////////


// Function that returns a logger with custom parameters
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: 'all'
        })
    ]
});

// Function that returns a logger with custom parameters for express
var expressLogger = new expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: true
        })
    ],
    meta: false,
    msg: "[{{req.timestamp}}] {{res.statusCode}} HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms",
    expressFormat: false,
    colorize: true
});


/////////////////////////////////////////////////// PUBLIC METHODS ///////////////////////////////////////////////////


// Function to use the customized logger
function log(level, message, filePath, functionName) {
    var logMessage = '[' + moment().format() + '] ' + message + ' on file (' + filePath + ')@' + functionName;
    logger.log(level, logMessage);
}

// Function that returns the instance for express logger
function getExpressLogger() {
    return expressLogger;
}


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.log = log;
module.exports.getExpressLogger = getExpressLogger;