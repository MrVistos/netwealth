const os = require('os');
const fs = require("fs");
const ws = require('ws');

class P2P {
    peers = []; // ["192.168.0.176:3333"]

    constructor(port) {
        this.port = port;
        this.ip = this.getLocalIPAddress();
        this.peers = this.loadPeers();
        this.initP2PServer();
        this.initP2PClient();
    }

    loadPeers = () => JSON.parse(fs.readFileSync('./peers.json', 'utf8'));
    savePeers = () => fs.writeFileSync('./peers.json', JSON.stringify(this.peers));

    initP2PServer = () => {
        const server = new ws.Server({ port: this.port });
        console.log(`Server listening on: ${this.ip}:${this.port}`);
        server.on('connection', (ws) => {
            console.log('Found new connection!');
            ws.on('message', (data) => {
                const message = JSON.parse(data);
                if (message.type === 'whoami') {
                    console.log(`Received whoami: ${message.data}`);
                    let index = this.peers.indexOf(message.data);
                    if (index === -1)
                        this.connectToPeer(message.data);
                }
                else
                    console.log(`Received unknown message: ${message}`);
            });
        });
    };

    initP2PClient = () => {
        console.log('Searching for reachable peers...');
        this.peers.forEach((peer) => {
            const [ip, port] = peer.split(':');
            if (ip !== this.ip || parseInt(port) !== this.port)
                this.connectToPeer(peer);
        });
    };

    connectToPeer = (peer) => {
        console.log('Trying to connect to', peer);
        const socket = new ws(`ws://${peer}`);
        socket.on('open', () => {
            console.log('Connected to', peer);
            socket.send(JSON.stringify({ type: 'whoami', data: this.ip + ':' + this.port }));
            let index = this.peers.indexOf(peer);
            if (index === -1) {
                this.peers.push(peer);
                this.savePeers();
            }
        });

        socket.on('close', () => {
            console.error(`Connection closed from ${peer}`);
            let index = this.peers.indexOf(peer);
            if (index > -1)
                this.peers.splice(index, 1);
            this.savePeers();
        });
/*
        socket.on('error', (err) => {
            console.log(`Connection error ${peer}: ${err.message}`);
            let index = this.peers.indexOf(peer);
            if (index > -1)
                this.peers.splice(index, 1);
            this.savePeers();
        });
*/
    };
/*
    initConnection = (ws) => {
        this.sockets.push(ws);
        this.initMessageHandler(ws);
        this.initErrorHandler(ws);
        this.sendPeers(ws);
        this.broadcastNewPeer(ws);
    };

    initMessageHandler = (ws) => {
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log(`Received message: ${data}`);
            this.handleMessage(message, ws);
        });
    };

    initErrorHandler = (ws) => {
        ws.on('close', () => {
            console.log('Connection closed');
            this.removeSocket(ws);
        });

        ws.on('error', (err) => {
            console.error(`Connection error: ${err.message}`);
            this.removeSocket(ws);
        });
    };

    removeSocket = (ws) => {
        this.sockets.splice(this.sockets.indexOf(ws), 1);
        const peerAddress = `ws://${ws._socket.remoteAddress.replace('::ffff:', '')}:${ws._socket.remotePort}`;
        this.knownPeers.delete(peerAddress);
    };

    connectToInitialPeers = () => {
        this.initialPeers.forEach((node) => {
            if (node.ip !== this.ip || node.port !== this.port) {
                const peerAddress = `ws://${node.ip}:${node.port}`;
                this.knownPeers.add(peerAddress);
                this.connectToPeer(peerAddress);
            }
        });
    };

    isValidPeer = (peer) => {
        const regex = /^ws:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/;
        return regex.test(peer);
    };

    sendPeers = (ws) => {
        const peerAddresses = Array.from(this.knownPeers).map((peer) => {
            const [ip, port] = peer.replace('ws://', '').split(':');
            return { ip, port: parseInt(port) };
        });
        ws.send(JSON.stringify({ type: 'peers', data: peerAddresses }));
    };

    broadcastNewPeer = (ws) => {
        const newPeer = {
            ip: ws._socket.remoteAddress.replace('::ffff:', ''),
            port: ws._socket.remotePort
        };
        const peerAddress = `ws://${newPeer.ip}:${newPeer.port}`;
        this.knownPeers.add(peerAddress);
        this.broadcast({
            type: 'new_peer',
            data: newPeer
        }, ws);
    };

    handleMessage = (message, ws) => {
        switch (message.type) {
            case 'peers':
                this.handlePeersMessage(message.data);
                break;
            default:
                console.log(`Unknown message type: ${message.type}`);
        }
    };

    handlePeersMessage = (peers) => {
        peers.forEach((peer) => {
            const peerAddress = `ws://${peer.ip}:${peer.port}`;
            if (!this.knownPeers.has(peerAddress) && (peer.ip !== this.ip || peer.port !== this.port)) {
                this.knownPeers.add(peerAddress);
                this.connectToPeer(peerAddress);
            }
        });
    };

    sendToPeers = (message) => {
        if (this.sockets.length > 0) {
            this.sockets.forEach((socket) => {
                socket.send(JSON.stringify(message));
            });
        } else {
            console.log('No peers connected.');
        }
    };

    broadcast = (data, sender) => {
        this.sockets.forEach((socket) => {
            if (socket !== sender && socket.readyState === webSocket.OPEN) {
                socket.send(JSON.stringify(data));
            }
        });
    };

    startPeerDiscovery = () => {
        setInterval(() => {
            this.sockets.forEach((socket) => {
                this.sendPeers(socket);
            });
            this.reconnectToKnownPeers();
        }, 10000); // alle 10 Sekunden
    };

    reconnectToKnownPeers = () => {
        this.knownPeers.forEach((peer) => {
            if (!this.sockets.some((socket) => {
                const [ip, port] = peer.replace('ws://', '').split(':');
                return socket._socket.remoteAddress.replace('::ffff:', '') === ip && socket._socket.remotePort === parseInt(port);
            })) {
                this.connectToPeer(peer);
            }
        });
    };
*/
    getLocalIPAddress = () => {
        const ifaces = os.networkInterfaces();
        let ipAddress = null;
        Object.keys(ifaces).forEach((ifname) => {
            ifaces[ifname].forEach((iface) => {
                if (iface.family === 'IPv4' && !iface.internal && iface.address !== '127.0.0.1') {
                    ipAddress = iface.address;
                }
            });
        });
        return ipAddress;
    };
}

module.exports = P2P;