'use strict';

var express = require('express');
var router = express.Router();
var blockchainRouter = require('./blockchainroute/blockchain');


router.get('/example', blockchainRouter.mapIndex);
router.get('/generate_new_contract', blockchainRouter.generateNewContract);


module.exports.router = router;
