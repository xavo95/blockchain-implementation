'use strict';

var mongoose = require('mongoose');


/////////////////////////////////////////////////// MONGOOSE MODEL ///////////////////////////////////////////////////


var ContractSchema = new mongoose.Schema({
    tracking_no: {type: String, required: true, index: {unique: true}},
    contract_address: {type: String, required: true}
});


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports = mongoose.model('Contract', ContractSchema);