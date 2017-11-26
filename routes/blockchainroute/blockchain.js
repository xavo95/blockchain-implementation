'use strict';

var blockchainController = require('./../../controllers/blockchainController');
var logger = require('./../utils/loggerfactory');


/////////////////////////////////////////////////// PRIVATE METHODS ///////////////////////////////////////////////////


// Function to update by address
var updateByAddres = function (req, res, address) {
    var temperature = req.body.temperature;
    if (temperature === null || temperature === undefined || temperature === '') {
        temperature = 0;
    }
    var delay = req.body.delay;
    if (delay === null || delay === undefined || delay === '') {
        delay = 0;
    }
    var pressure = req.body.pressure;
    if (pressure === null || pressure === undefined || pressure === '') {
        pressure = 0;
    }
    var light = req.body.light;
    if (light === null || light === undefined || light === '') {
        light = 0;
    }
    var breakageAlert = req.body.breakageAlert;
    if (breakageAlert === null || breakageAlert === undefined || breakageAlert === '') {
        breakageAlert = 0;
    }
    var callback = function (err) {
        if (err) {
            logger.log('error', 'Error performing the query: ' + err, 'routes/blockchainroute/blockchain.js', 'updateContract');
            return res.status(503).send({message: 'Error performing the query: ' + err});
        } else {
            logger.log('info', 'Contract data updated successfully at address: ' + address, 'routes/blockchainroute/blockchain.js', 'updateContract');
            return res.status(200).send({message: 'Contract data updated successfully at address: ' + address});
        }
    };
    blockchainController.updateContractByAddress(callback, address, temperature, delay, pressure, light, breakageAlert);
};


/////////////////////////////////////////////////// PUBLIC METHODS ///////////////////////////////////////////////////


// Function to make example test
var mapIndex = function (req, res) {
    logger.log('info', 'Blockchain Implementation', 'routes/blockchainroute/blockchain.js', 'mapIndex');
    return res.status(200).send({'msg': 'Blockchain Implementation'});
};

// Function to generate a new contract, takes tracking_no as body parameter
var generateNewContract = function (req, res) {
    var tracking_no = req.body.tracking_no;
    if (tracking_no === null || tracking_no === undefined || tracking_no === '') {
        logger.log('error', 'Invalid tracking number', 'routes/blockchainroute/blockchain.js', 'generateNewContract');
        return res.status(503).send({message: 'Invalid tracking number'});
    } else {
        var callback = function (err) {
            if (err) {
                logger.log('error', 'Error performing the query: ' + err, 'routes/blockchainroute/blockchain.js', 'generateNewContract');
                return res.status(503).send({message: 'Error performing the query: ' + err});
            } else {
                logger.log('info', 'Contract added successfully', 'routes/blockchainroute/blockchain.js', 'generateNewContract');
                return res.status(200).send({message: 'Contract added successfully'});
            }
        };
        blockchainController.generateNewContract(callback, tracking_no);
    }
};

// Function to get all contracts
var getAllContracts = function (req, res) {
    var callback = function (err, contracts) {
        if (err) {
            logger.log('error', 'Error performing the query: ' + err, 'routes/blockchainroute/blockchain.js', 'getAllContracts');
            return res.status(503).send({message: 'Error performing the query: ' + err});
        } else if (!contracts) {
            logger.log('error', 'There is no contracts on database', 'routes/blockchainroute/blockchain.js', 'getAllContracts');
            return res.status(404).send({message: 'There is no contracts on database'});
        } else if (contracts.length === 0) {
            logger.log('error', 'There is no contracts on database', 'routes/blockchainroute/blockchain.js', 'getAllContracts');
            return res.status(404).send({message: 'There is no contracts on database'});
        } else {
            logger.log('info', 'Contracts retrieved successfully', 'routes/blockchainroute/blockchain.js', 'getAllContracts');
            return res.status(200).send(contracts);
        }
    };
    blockchainController.getAllContracts(callback);
};

// Function to get a contract by tacking number
var getContractByTrackingNumber = function (req, res) {
    var tracking_no = req.params.tracking_no;
    if (tracking_no === null || tracking_no === undefined || tracking_no === '') {
        logger.log('error', 'Invalid tracking number', 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
        return res.status(503).send({message: 'Invalid tracking number'});
    } else {
        var callback = function (err, contracts) {
            if (err) {
                logger.log('error', 'Error performing the query: ' + err, 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                return res.status(503).send({message: 'Error performing the query: ' + err});
            } else if (!contracts) {
                logger.log('error', 'There is no contracts on database by that tracking number', 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                return res.status(404).send({message: 'There is no contracts on database by that tracking number'});
            } else if (contracts.length === 0) {
                logger.log('error', 'There is no contracts on database by that tracking number', 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                return res.status(404).send({message: 'There is no contracts on database by that tracking number'});
            } else {
                logger.log('info', 'Contract retrieved successfully by tracking number: ' + tracking_no, 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                return res.status(200).send(contracts);
            }
        };
        blockchainController.getContractByTrackingNumber(callback, tracking_no);
    }
};

// Function to get a contract by tacking number
var getContractData = function (req, res) {
    var address = req.params.address;
    if (address === null || address === undefined || address === '') {
        logger.log('error', 'Invalid address', 'routes/blockchainroute/blockchain.js', 'getContractData');
        return res.status(503).send({message: 'Invalid address'});
    } else {
        var callback = function (err, info) {
            if (err) {
                logger.log('error', 'Error performing the query: ' + err, 'routes/blockchainroute/blockchain.js', 'getContractData');
                return res.status(503).send({message: 'Error performing the query: ' + err});
            } else {
                logger.log('info', 'Contract data retrieved successfully at address: ' + address, 'routes/blockchainroute/blockchain.js', 'getContractData');
                return res.status(200).send(blockchainController.arrayToIncidentData(info));
            }
        };
        blockchainController.getContractData(callback, address);
    }
};

// Function to update the contract by address
var updateContractByAddress = function (req, res) {
    var address = req.params.address;
    if (address === null || address === undefined || address === '') {
        logger.log('error', 'Invalid address', 'routes/blockchainroute/blockchain.js', 'updateContractByAddress');
        return res.status(503).send({message: 'Invalid address'});
    } else {
        updateByAddres(req, res, address);
    }
};

// Function to update the contract by tracking number
var updateContractByTracking = function (req, res) {
    var tracking_no = req.params.tracking_no;
    if (tracking_no === null || tracking_no === undefined || tracking_no === '') {
        logger.log('error', 'Invalid tracking number', 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
        return res.status(503).send({message: 'Invalid tracking number'});
    } else {
        var callback = function (err, contracts) {
            if (err) {
                logger.log('error', 'Error performing the query: ' + err, 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                return res.status(503).send({message: 'Error performing the query: ' + err});
            } else if (!contracts) {
                logger.log('error', 'There is no contracts on database by that tracking number', 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                return res.status(404).send({message: 'There is no contracts on database by that tracking number'});
            } else if (contracts.length === 0) {
                logger.log('error', 'There is no contracts on database by that tracking number', 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                return res.status(404).send({message: 'There is no contracts on database by that tracking number'});
            } else {
                logger.log('info', 'Contract retrieved successfully by tracking number: ' + tracking_no, 'routes/blockchainroute/blockchain.js', 'getContractByTrackingNumber');
                updateByAddres(req, res, contracts.contract_address);
            }
        };
        blockchainController.getContractByTrackingNumber(callback, tracking_no);
    }
};


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.mapIndex = mapIndex;
module.exports.generateNewContract = generateNewContract;
module.exports.getAllContracts = getAllContracts;
module.exports.getContractByTrackingNumber = getContractByTrackingNumber;
module.exports.getContractData = getContractData;
module.exports.updateContractByAddress = updateContractByAddress;
module.exports.updateContractByTracking = updateContractByTracking;
