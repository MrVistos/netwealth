import 'dart:convert';
import 'dart:async';
import 'dart:io';

import 'package:netwealth/src/util.dart';

class Node {
  List<WebSocket> sockets = []; // current sockets
  List<String> peers = []; // current peers
  int peerInterval = 5; // peer refresh interval in seconds

  late Function apiCallback;
  late Function wsCallback;
  late String origin;
  late int isOrigin;
  late int port;

  Node(this.port, this.isOrigin, this.origin, this.wsCallback,
      this.apiCallback) {
    init();
  }

  void init() async {
    peers = loadPeers();
    if (peers.isEmpty && isOrigin == 0) {
      peers.add(origin);
    }
    for (String peer in peers) {
      connectToPeer(peer);
    }
    await initServer();
  }

  List<String> loadPeers() {
    try {
      String contents = File(path['peers']).readAsStringSync();
      List<dynamic> parsed = json.decode(contents);
      return List<String>.from(parsed);
    } catch (e) {
      log('Error loading peers: $e');
    }
    return [];
  }

  void savePeers() {
    try {
      File(path['peers']).writeAsStringSync(json.encode(peers));
    } catch (e) {
      log('Error saving peers: $e');
    }
  }

  Future<void> initServer() async {
    HttpServer server = await HttpServer.bind(InternetAddress.anyIPv4, port);
    log('Server listening port: $port');
    await for (HttpRequest req in server) {
      if (req.uri.path == '/ws') {
        WebSocketTransformer.upgrade(req).then((socket) {
          var connection = req.connectionInfo;
          if (connection != null) {
            socket.listen((data) {
              Map<String, dynamic> message = json.decode(data);
              if (message['type'] == 'handshake') {
                String address =
                    '${connection.remoteAddress.address}:${message['data']}';
                log('Handshake from $address');
                if (!peers.contains(address)) {
                  connectToPeer(address);
                }
              } else if (message['type'] == 'peers') {
                Set<String> combinedSet = {...peers, ...message['data']};
                List<String> combinedList = combinedSet.toList();
                log('Received $peers');
                connectToNewPeers(combinedList);
                savePeers();
              } else {
                wsCallback(message['type'], message['data']);
              }
            });
          }
        });
      } else if (req.uri.path == '/api') {
        final body = await utf8.decodeStream(req);
        apiCallback(req.method, body);
      }
    }
  }

  void connectToNewPeers(List<String> newPeers) {
    for (var peer in newPeers) {
      if (!peers.contains(peer)) {
        connectToPeer(peer);
      }
    }
    peers = newPeers;
  }

  void connectToPeer(String peer) async {
    if (await isOwnAddress(peer, port) == false) {
      try {
        WebSocket socket = await WebSocket.connect('ws://$peer/ws');
        sockets.add(socket);
        log('Socket opened to $peer');
        socket.add(json.encode({'type': 'handshake', 'data': '$port'}));
        Timer.periodic(Duration(seconds: peerInterval), (Timer timer) {
          socket.add(json.encode({'type': 'peers', 'data': peers}));
        });
        if (!peers.contains(peer)) {
          peers.add(peer);
          savePeers();
        }
        socket.listen((data) {
          log('Socket data from $peer: $data');
        }, onError: (error) {
          log('Socket error from $peer: $error');
          sockets.remove(socket);
          peers.remove(peer);
          savePeers();
        }, onDone: () {
          log('Socket closed from $peer');
          sockets.remove(socket);
          peers.remove(peer);
          savePeers();
        });
      } catch (e) {
        peers.remove(peer);
        savePeers();
      }
    }
  }

  void broadcast(type, data) {
    for (WebSocket socket in sockets) {
      socket.add(json.encode({'type': type, 'data': '$data'}));
    }
  }
}
