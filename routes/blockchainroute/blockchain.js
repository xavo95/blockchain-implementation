'use strict';

var blockchainController = require('./../../controllers/blockchainController');


var mapIndex = function (req, res) {
    res.status(200);
    res.json({'msg': 'Blockchain Implementation'});
};

var generateNewContract = function (req, res) {
    blockchainController.generateNewContract();
    res.status(200);
    res.json({'msg': 'New contract generated'});
};


module.exports.mapIndex = mapIndex;
module.exports.generateNewContract = generateNewContract;