const Block = require('./Block');
const Transaction = require('./Transaction');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.validators = {};
        this.stake = {};
    }

    createGenesisBlock() {
        return new Block(0, Date.now().toString(), '0', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    addValidator(validatorAddress, amount) {
        if (!this.stake[validatorAddress]) {
            this.stake[validatorAddress] = 0;
        }
        this.stake[validatorAddress] += amount;

        if (!this.validators[validatorAddress]) {
            this.validators[validatorAddress] = true;
        }
    }

    chooseValidator() {
        const validators = Object.keys(this.validators);
        const totalStake = Object.values(this.stake).reduce((a, b) => a + b, 0);
        let random = Math.floor(Math.random() * totalStake);

        for (let validator of validators) {
            random -= this.stake[validator];
            if (random < 0) {
                return validator;
            }
        }
    }

    minePendingTransactions() {
        const validator = this.chooseValidator();
        const block = new Block(
            this.chain.length,
            Date.now().toString(),
            this.getLatestBlock().hash,
            this.pendingTransactions,
            validator
        );
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, validator, this.miningReward)
        ];

        console.log(`Block successfully added by validator: ${validator}`);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.data) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;