'use strict';

var fs = require('fs');

var Web3 = require('web3');
var solc = require('solc');
var testRPC = require('ethereumjs-testrpc');
var mongoose = require('mongoose');


var logger = require('./../routes/utils/loggerfactory');
var web3 = new Web3(testRPC.provider({
    debug: true,
    mnemonic: 'dead fish racket soul plunger dirty boats cracker mammal nicholas cage',
    total_accounts: 10,
    unlocked_accounts: [0, 1, 2]
}));
logger.log('info', 'Ethereum network configured correctly', 'routes/blockchainroute/blockchain.js', 'root');


// Compile the source code
var input = fs.readFileSync('./contracts/TruckContract.sol');
var output = solc.compile(input.toString(), 1);
var bytecode = output.contracts[':TruckContract'].bytecode;
var abi = JSON.parse(output.contracts[':TruckContract'].interface);
var STATIC_ADDRESS = '0xc31eb6e317054a79bb5e442d686cb9b225670c1d';


var arrayToIncidentData = function (toConvert) {
    return {
        temperature: toConvert[0],
        delay: toConvert[1],
        pressure: toConvert[2],
        light: toConvert[3],
        breakageAlert: toConvert[4]
    };
};

var setIncidentData = function (contract, temperature, delay, pressure, light, breakageAlert) {
    return new Promise(function (resolve) {
        contract.methods.setIncidentData(temperature, delay, pressure, light, breakageAlert).send({from: STATIC_ADDRESS})
            .then(function () {
                logger.log('info', 'Successfully modified contract', 'routes/blockchainroute/blockchain.js', 'setIncidentData');
                resolve();
            });
    });
};


var generateNewContract = function () {
    // Contract object
    var contract = new web3.eth.Contract(abi, {
        from: STATIC_ADDRESS,
        gasPrice: '2000000000',
        gas: 90000 * 2,
        data: '0x' + bytecode
    });

    contract.deploy({
        arguments: ['Default Contract']
    }).send({
        from: STATIC_ADDRESS,
        gas: 1500000,
        gasPrice: '30000000000000'
    }, function (error, transactionHash) {
    }).on('error', function (error) {
        logger.log('error', error, 'routes/blockchainroute/blockchain.js', 'root');
    }).on('transactionHash', function (transactionHash) {
        logger.log('info', 'New transaction, transaction hash: ' + transactionHash, 'routes/blockchainroute/blockchain.js', 'root');
    }).on('receipt', function (receipt) {
        logger.log('info', 'Receipt received, new contract address: ' + receipt.contractAddress, 'routes/blockchainroute/blockchain.js', 'root');
    }).on('confirmation', function (confirmationNumber, receipt) {
    }).then(function (newContractInstance) {
        newContractInstance.methods.getContractAddress().call(function (error, result) {

        });
        // newContractInstance.methods.getIncidentData().call(function (error, result) {
        //     var incident_data = arrayToIncidentData(result);
        //     console.log(incident_data);
        //
        //     setIncidentData(newContractInstance, 1, 2, 3, 4, 5).then(function () {
        //         newContractInstance.methods.getContractAddress().call(function (error, result) {
        //             var MyContract = new web3.eth.Contract(abi, result);
        //             MyContract.methods.getIncidentData().call(function (error, result) {
        //                 var incident_data = arrayToIncidentData(result);
        //                 console.log(incident_data);
        //             });
        //         });
        //     });
        // });
    });
};


module.exports.generateNewContract = generateNewContract;