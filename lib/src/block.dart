import 'dart:convert';
import 'package:crypto/crypto.dart';

import 'package:netwealth/src/transaction.dart';

class Block {
  int index;
  DateTime timestamp;
  String previousHash;
  List<Transaction> data;
  String validator;
  String hash;

  Block(
      this.index, this.timestamp, this.previousHash, this.data, this.validator)
      : hash = calculateHash(index, timestamp, previousHash, data, validator);

  static String calculateHash(int index, DateTime timestamp,
      String previousHash, List<Transaction> data, String validator) {
    final dataString =
        jsonEncode(data.map((transaction) => transaction.toJson()).toList());
    final input = '$index$timestamp$previousHash$dataString$validator';
    return sha256.convert(utf8.encode(input)).toString();
  }
}
