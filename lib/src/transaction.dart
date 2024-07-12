class Transaction {
  String fromAddress;
  String toAddress;
  double amount;

  Transaction(this.fromAddress, this.toAddress, this.amount);

  Map<String, dynamic> toJson() {
    return {
      'fromAddress': fromAddress,
      'toAddress': toAddress,
      'amount': amount,
    };
  }

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      json['fromAddress'],
      json['toAddress'],
      json['amount'].toDouble(),
    );
  }
}
