import 'dart:convert';

import 'package:crypto/crypto.dart';

import 'block.dart';
import 'transaction.dart';

class Blockchain {
  List<Block> chain;
  List<Transaction> pendingTransactions;
  Map<String, bool> validators;
  Map<String, double> stake;
  double miningReward;

  Blockchain()
      : chain = [],
        pendingTransactions = [],
        validators = {},
        stake = {},
        miningReward = 100.0 {
    chain.add(createGenesisBlock());
  }

  Block createGenesisBlock() {
    return Block(0, DateTime.now(), '0', [], '0');
  }

  Block getLatestBlock() {
    return chain.last;
  }

  void createTransaction(Transaction transaction) {
    pendingTransactions.add(transaction);
  }

  void addValidator(String validatorAddress, double amount) {
    if (stake.containsKey(validatorAddress)) {
      //stake[validatorAddress]! += amount;
    } else {
      stake[validatorAddress] = amount;
    }

    if (!validators.containsKey(validatorAddress)) {
      validators[validatorAddress] = true;
    }
  }

  String chooseValidator() {
    final validatorsList = validators.keys.toList();
    final totalStake = stake.values.reduce((a, b) => a + b);
    final random = DateTime.now().millisecondsSinceEpoch % totalStake.toInt();

    var cumulativeStake = 0.0;
    for (var validator in validatorsList) {
      cumulativeStake += stake[validator]!;
      if (cumulativeStake >= random) {
        return validator;
      }
    }
    return validatorsList.last;
  }

  void minePendingTransactions() {
    final validator = chooseValidator();
    final block = Block(
      chain.length,
      DateTime.now(),
      getLatestBlock().hash,
      List<Transaction>.from(pendingTransactions),
      validator,
    );
    chain.add(block);

    pendingTransactions = [
      //Transaction(null, validator, miningReward),
    ];

    print('Block successfully added by validator: $validator');
  }

  double getBalanceOfAddress(String address) {
    double balance = 0;

    for (var block in chain) {
      for (var transaction in block.data) {
        if (transaction.fromAddress == address) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress == address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }

  bool isChainValid() {
    for (var i = 1; i < chain.length; i++) {
      final currentBlock = chain[i];
      final previousBlock = chain[i - 1];

      if (currentBlock.hash !=
          calculateHash(
              currentBlock.index,
              currentBlock.timestamp,
              currentBlock.previousHash,
              currentBlock.data,
              currentBlock.validator)) {
        return false;
      }

      if (currentBlock.previousHash != previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  static String calculateHash(int index, DateTime timestamp,
      String previousHash, List<Transaction> data, String validator) {
    final dataString =
        jsonEncode(data.map((transaction) => transaction.toJson()).toList());
    final input = '$index$timestamp$previousHash$dataString$validator';
    return sha256.convert(utf8.encode(input)).toString();
  }
}
