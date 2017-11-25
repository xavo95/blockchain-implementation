'use strict';

var moment = require('moment');


/////////////////////////////////////////////////// PUBLIC METHODS ///////////////////////////////////////////////////


// Function to inject the timestamp into the requests
var loggerTimestampMiddleware = function (req, res, next) {
    req.timestamp = moment().format();
    next();
};


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.loggerTimestampMiddleware = loggerTimestampMiddleware;