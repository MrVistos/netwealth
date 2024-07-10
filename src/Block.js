const crypto = require("crypto-js");

class Block {
    constructor(index, timestamp, previousHash, data, validator) {
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.data = data;
        this.validator = validator;
        this.hash = this.calculateHash();
    }

    calculateHash = () => {
        return crypto.SHA256(
            this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.validator
        ).toString();
    }
}

module.exports = Block;