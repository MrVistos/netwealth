import 'dart:io';

Map<String, dynamic> path = {
  'settings': isDaemon() ? 'settings.json' : '../settings.json',
  'blockchain': isDaemon() ? 'blockchain.json' : '../blockchain.json',
  'peers': isDaemon() ? 'peers.json' : '../peers.json'
};

isDaemon() {
  File jsonFile = File('settings.json');
  return jsonFile.existsSync() ? true : false;
}

void log(message) {
  DateTime now = DateTime.now();
  String formattedTime =
      '${now.hour}:${now.minute}:${now.second}.${now.millisecond}';
  print('[$formattedTime] $message');
}

Future<bool> isOwnAddress(String address, int port) async {
  List<String> parts = address.split(':');
  try {
    // Hole alle Netzwerkinterfaces
    List<NetworkInterface> interfaces = await NetworkInterface.list();

    // Iteriere durch alle Interfaces und deren Adressen
    for (var interface in interfaces) {
      for (var addr in interface.addresses) {
        if (addr.address == parts[0] && port == int.parse(parts[1])) {
          return true;
        }
      }
    }
  } catch (e) {
    print('Error checking IP address: $e');
  }

  return false;
}
