import 'dart:async';

import 'package:netwealth/src/blockchain.dart';
import 'package:netwealth/src/node.dart';
import 'package:netwealth/src/util.dart';

class NetWealth {
  late String origin;
  late int isOrigin;
  late int port;

  NetWealth(this.port, this.isOrigin, this.origin) {
    init();
  }

  void init() {
    Blockchain blockchain = Blockchain();
    if (blockchain.chain.isEmpty) {
      log('try to download blockchain or add genesis block');
    }

    Node node = Node(port, isOrigin, origin, (type, data) {
      log('(Socket) Received $type $data');
    }, (method, body) {
      log('(API) Received $method $body');
    });

    Timer.periodic(Duration(seconds: 5), (Timer timer) {
      node.broadcast('blockchain', 'from port $port');
    });
  }
}
