const fs = require('fs');
const ec = new (require('elliptic').ec)('secp256k1');

class Wallet {
    path = './keys.json';
    prefix = 'nw';
    index = 0;

    constructor() {
        if (!fs.existsSync(this.path))
            this.createKeysFile();
        //this.test();
    };

    test = () => {
        const privateKeys = this.getPrivateKeysFromWallet();
        const privateKey = privateKeys[this.index];
        const publicKey = this.getPublicFromPrivateKey(privateKey);
        const isValid = this.isKeyPairValid(privateKey, publicKey);
        console.log(`Private Key; ${privateKey}`);
        console.log(`Public Key: ${publicKey}`);
        console.log(`Keys valid: ${isValid}`);
    }

    createKeysFile = () => {
        const privateKey = this.generatePrivateKey();
        const keys = [privateKey];
        fs.writeFileSync(this.path, JSON.stringify(keys, null, 2));
    };

    addPrivateKeyToFile = () => {
        const privateKeys = this.getPrivateKeysFromWallet();
        const newPrivateKey = this.generatePrivateKey();
        privateKeys.push(newPrivateKey);
        fs.writeFileSync(this.path, JSON.stringify(privateKeys, null, 2));
    };

    generatePrivateKey = () => {
        const keyPair = ec.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    };

    getPrivateKeysFromWallet = (index = null) => {
        const buffer = fs.readFileSync(this.path, 'utf8');
        const privateKeys = JSON.parse(buffer);
        if (index !== null) {
            return privateKeys[index];
        }
        return privateKeys;
    };
    
    getPublicFromPrivateKey = (privateKey) => {
        const key = ec.keyFromPrivate(privateKey, 'hex');
        const compressedPublicKey = key.getPublic().encodeCompressed('hex');
        return this.prefix + compressedPublicKey;
    };

    isKeyPairValid = (privateKey, publicKey) => {
        const generatedPublicKey = this.getPublicFromPrivateKey(privateKey);
        return generatedPublicKey === publicKey;
    };
}

module.exports = Wallet;
