'use strict';

require('dotenv').config();
var fs = require('fs');
var path = require("path");
var Web3 = require('web3');
var solc = require('solc');
var testRPC = require('ethereumjs-testrpc');
var mkdirp = require('mkdirp');
var SHA3 = require('sha3');


var contractsController = require('./dbController');
var logger = require('./../routes/utils/loggerfactory');


// Get all the config variables
var configTestRPCMnemonic = process.env.TESTRPCMNEMONIC;
var testRPCMnemonic = (configTestRPCMnemonic !== undefined ? configTestRPCMnemonic : 'dead fish racket soul plunger dirty boats cracker mammal nicholas cage');
var configTestRPCTotalAccounts = process.env.TESTRPCTOTALACCOUNTS;
var testRPCTotalAccounts = (configTestRPCTotalAccounts !== undefined ? configTestRPCTotalAccounts : 10);
var configTestRPCPath = process.env.TESTRPCPATH;
var testRPCPath = (configTestRPCPath !== undefined ? configTestRPCPath : 'testrpc_db');
var configTestRPCPort = process.env.TESTRPCPORT;
var testRPCPort = (configTestRPCPort !== undefined ? configTestRPCPort : 8545);

// Create the directory for blockchain persistency
mkdirp(path.join(process.cwd(), '/' + testRPCPath), function (err) {
    if (err) {
        logger.log('error', 'Errors happened while creating the directory: ' + err, 'controllers/blockchainController.js', 'root');
    }
    logger.log('info', 'Directory created successfully at ' + testRPCPath + ' !', 'controllers/blockchainController.js', 'root');
});

// Set up the provider and log the status
var web3 = new Web3(testRPC.provider({
    debug: true,
    mnemonic: testRPCMnemonic,
    total_accounts: testRPCTotalAccounts,
    unlocked_accounts: [0, 1, 2],
    db_path: testRPCPath,
    port: testRPCPort
}));
logger.log('info', 'Ethereum network configured correctly', 'controllers/blockchainController.js', 'root');


// Compile the source code
var input = fs.readFileSync('./contracts/TruckContract.sol');
var output = solc.compile(input.toString(), 1);
var bytecode = output.contracts[':TruckContract'].bytecode;
var abi = JSON.parse(output.contracts[':TruckContract'].interface);
var configStaticAddress = process.env.STATICADDRESS;
var STATIC_ADDRESS = (configStaticAddress !== undefined ? configStaticAddress : '0xc31eb6e317054a79bb5e442d686cb9b225670c1d');


/////////////////////////////////////////////////// PRIVATE METHODS ///////////////////////////////////////////////////


// Function that returns a promise that resolves upon contract modification
var setIncidentData = function (contract, temperature, delay, pressure, light, breakageAlert) {
    return new Promise(function (resolve) {
        contract.methods.setIncidentData(temperature, delay, pressure, light, breakageAlert).send({
            from: STATIC_ADDRESS,
            gas: 500000
        }).then(function () {
            logger.log('info', 'Successfully modified contract', 'controllers/blockchainController.js', 'setIncidentData');
            resolve();
        });
    });
};

// Checks if the given string is an address
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

// Checks if the given string is a checksummed address
var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x', '');
    var d = new SHA3.SHA3Hash();
    d.update(address.toLowerCase());
    var addressHash = d.digest('hex');
    for (var i = 0; i < 40; i++) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};


/////////////////////////////////////////////////// PUBLIC METHODS ///////////////////////////////////////////////////


// Function to convert array from blockchain to dictionary
var arrayToIncidentData = function (toConvert) {
    return {
        temperature: toConvert[0],
        delay: toConvert[1],
        pressure: toConvert[2],
        light: toConvert[3],
        breakageAlert: toConvert[4]
    };
};

// Function that generates a new contract and saves his address onto the database with the tracking number as reference
var generateNewContract = function (callback, tracking_no) {
    // Contract object
    var contract = new web3.eth.Contract(abi);
    contract.options.from = STATIC_ADDRESS;
    contract.options.gasPrice = '2000000000';
    contract.options.gas = 90000 * 2;
    contract.options.data = '0x' + bytecode;

    contract.deploy({
        arguments: ['Default Contract']
    }).send({
        from: STATIC_ADDRESS,
        gas: 1500000,
        gasPrice: '2000000000'
    }, function (error, transactionHash) {
    }).on('error', function (error) {
        logger.log('error', error, 'routes/blockchainroute/blockchain.js', 'root');
    }).on('transactionHash', function (transactionHash) {
        logger.log('info', 'New transaction, transaction hash: ' + transactionHash, 'routes/blockchainroute/blockchain.js', 'root');
    }).on('receipt', function (receipt) {
        logger.log('info', 'Receipt received, new contract address: ' + receipt.contractAddress, 'routes/blockchainroute/blockchain.js', 'root');
    }).on('confirmation', function (confirmationNumber, receipt) {
    }).then(function (newContractInstance) {
        newContractInstance.methods.getContractAddress().call(function (error, address) {
            if (error) {
                return callback(error)
            } else {
                contractsController.addContract(callback, tracking_no, address);
            }
        });
    });
};

// Function to get all contracts
var getAllContracts = function (callback) {
    contractsController.getContracts(callback);
};

// Function to get a contract by tacking number
var getContractByTrackingNumber = function (callback, tracking) {
    contractsController.getContractByTracking(callback, tracking);
};

// Function to get contract info at address
// TODO: Finish SHA3 check
var getContractData = function (callback, address) {
    // if (isAddress(address)) {
    //     var contract = new web3.eth.Contract(abi, address);
    //     contract.methods.getIncidentData().call(function (error, result) {
    //         callback(error, result);
    //     });
    // } else {
    //     callback('The address is invalid', null);
    // }
    var contract = new web3.eth.Contract(abi, address);
    contract.methods.getIncidentData().call(function (error, result) {
        callback(error, result);
    });
};

// Function to update the contract
var updateContractByAddress = function (callback, address, temperature, delay, pressure, light, breakageAlert) {
    var contract = new web3.eth.Contract(abi, address);
    setIncidentData(contract, temperature, delay, pressure, light, breakageAlert).then(function () {
        callback(null);
    });
};


////////////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////////////


module.exports.arrayToIncidentData = arrayToIncidentData;
module.exports.generateNewContract = generateNewContract;
module.exports.getAllContracts = getAllContracts;
module.exports.getContractByTrackingNumber = getContractByTrackingNumber;
module.exports.getContractData = getContractData;
module.exports.updateContractByAddress = updateContractByAddress;