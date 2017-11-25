'use strict';

var express = require('express');
var router = express.Router();
var blockchainRouter = require('./blockchainroute/blockchain');


/////////////////////////////////////////////////// ROUTER MAPPING ///////////////////////////////////////////////////


router.get('/example', blockchainRouter.mapIndex);
router.post('/generate_new_contract', blockchainRouter.generateNewContract);
router.get('/get_all_contracts', blockchainRouter.getAllContracts);
router.get('/get_contract_by_id/:tracking_no', blockchainRouter.getContractByTrackingNumber);


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.router = router;
