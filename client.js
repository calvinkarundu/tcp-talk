/* @flow */

require('dotenv').load();
var net = require('net');
var host = process.env.HOST || 'localhost';
var port = process.env.PORT || '5000';

var client = net.connect({
  port: port,
  host: host
});

client.on('error', onError);
client.on('connect', onConnect);
client.on('end', onEnd);

function onError(error) {
	console.error(error);
}

function onConnect() {
  var connInfo = client.address();
	console.log("Connected ( " + connInfo.address + ":" + connInfo.port + " )");
}

function onEnd() {
  console.log("Connection lost!");
}

process.stdin.on('data', function (data) {
  client.write(data);
});

client.on('data', function (data) {
  process.stdout.write(data);
});
