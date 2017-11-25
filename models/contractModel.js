'use strict';

var mongoose = require('mongoose');

var ContractSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    age: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('Contract', ContractSchema);