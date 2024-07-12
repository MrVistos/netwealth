import 'dart:convert';
import 'dart:io';

import 'package:netwealth/src/block.dart';
import 'package:netwealth/src/transaction.dart';
import 'package:netwealth/src/util.dart';

class Blockchain {
  List<Block> chain = [];
  List<Transaction> pendingTransactions = [];

  Blockchain() {
    init();
  }

  void init() async {
    chain = loadBlockchain();
  }

  List<Block> loadBlockchain() {
    try {
      var contents = File(path['blockchain']).readAsStringSync();
      var parsed = json.decode(contents);
      if (parsed is List<dynamic>) {
        return List<Block>.from(parsed);
      }
    } catch (e) {
      print('Error loading blockchain: $e');
    }
    return [];
  }

  void saveBlockchain() {
    try {
      File(path['blockchain']).writeAsStringSync(json.encode(chain));
    } catch (e) {
      print('Error saving blockchain: $e');
    }
  }
}
