const Blockchain = require('./src/Blockchain');
const Transaction = require('./src/Transaction');
const Wallet = require('./src/Wallet');
const HTTP = require('./src/HTTP');
const P2P = require('./src/P2P');

const port = parseInt(process.argv[2]) || 3333;
const p2pServer = new P2P(port);

/*
const wallet = new Wallet();

const myCoin = new Blockchain();

myCoin.addValidator('validator1', 100);
myCoin.addValidator('validator2', 50);

myCoin.createTransaction(new Transaction('address1', 'address2', 100));
myCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('Starting the validator...');
myCoin.minePendingTransactions();

console.log('Balance of address1:', myCoin.getBalanceOfAddress('address1'));
console.log('Balance of address2:', myCoin.getBalanceOfAddress('address2'));
console.log('Balance of validator1:', myCoin.getBalanceOfAddress('validator1'));
console.log('Balance of validator2:', myCoin.getBalanceOfAddress('validator2'));
*/