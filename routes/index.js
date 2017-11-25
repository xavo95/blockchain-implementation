'use strict';

var express = require('express');
var router = express.Router();
var blockchainRouter = require('./blockchainroute/blockchain');


/////////////////////////////////////////////////// ROUTER MAPPING ///////////////////////////////////////////////////


router.get('/example', blockchainRouter.mapIndex);
router.post('/generate_new_contract', blockchainRouter.generateNewContract);


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.router = router;
