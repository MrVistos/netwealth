const bodyParser = require("body-parser");
const express = require("express");

class HTTP {
    constructor(port) {
        this.port = port;
        this.initHttpServer();
    }

    initHttpServer = () => {
        const app = express();
        app.use(bodyParser.json());
    
        app.use((err, req, res, next) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                next();
            }
        });
    
        app.post('/mine', (req, res) => {
            const newBlock = generateNextBlock();
            if (newBlock === null) {
                res.status(400).send('could not generate block');
            } else {
                res.send(newBlock);
            }
        });
    
        app.get('/balance', (req, res) => {
            res.send({ 'balance': 1 });
        });
    
        app.listen(this.port, () => {
            console.log(`Listening http on port: ${this.port}`);
        });
    };
}

module.exports = HTTP;