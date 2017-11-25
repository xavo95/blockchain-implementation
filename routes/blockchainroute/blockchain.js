'use strict';

var blockchainController = require('./../../controllers/blockchainController');
var logger = require('./../utils/loggerfactory');


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


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.mapIndex = mapIndex;
module.exports.generateNewContract = generateNewContract;
module.exports.getAllContracts = getAllContracts;
module.exports.getContractByTrackingNumber = getContractByTrackingNumber;
