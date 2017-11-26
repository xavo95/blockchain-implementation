'use strict';


/////////////////////////////////////////////////// PUBLIC METHODS ///////////////////////////////////////////////////


// Function to inject the timestamp into the requests
var corsMiddleware = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.corsMiddleware = corsMiddleware;