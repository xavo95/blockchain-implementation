'use strict';

var Contracts = require('../models/contractModel');


/////////////////////////////////////////////////// PUBLIC METHODS ///////////////////////////////////////////////////


// Function to add the contract address into the db
var addContract = function (callback, tracking, address) {
    var contract = new Contracts({
        tracking_no: tracking,
        contract_address: address
    });
    contract.save(function (err) {
        callback(err);
    });
};

// Function to get the list of all contracts in the DB
var getContracts = function (callback) {
    Contracts.find({}, function (err, contracts) {
        callback(err, contracts);
    });
};

// Function to get the contract by the tracking number
var getContractByTracking = function (callback, tracking) {
    Contracts.findOne({tracking_no: tracking}, function (err, contracts) {
        callback(err, contracts);
    });
};


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.addContract = addContract;
module.exports.getContracts = getContracts;
module.exports.getContractByTracking = getContractByTracking;