import 'dart:convert';
import 'dart:io';

import 'package:netwealth/netwealth.dart';
import 'package:netwealth/src/util.dart';

void main(List<String> arguments) {
  try {
    String contents = File(path['settings']).readAsStringSync();
    Map<String, dynamic> parsed = json.decode(contents);
    NetWealth(parsed['port'], parsed['isOrigin'], parsed['origin']);
  } catch (e) {
    log('Error starting daemon: $e');
  }
}
