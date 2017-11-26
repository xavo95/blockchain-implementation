'use strict';


/////////////////////////////////////////////////// PUBLIC METHODS ///////////////////////////////////////////////////


// Function to inject the timestamp into the requests
var corsMiddleware = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token, userData");
    next();
};


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.corsMiddleware = corsMiddleware;