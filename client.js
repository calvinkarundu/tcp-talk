/* @flow */

require('dotenv').load();
require('lookup-multicast-dns/global');
var net = require('net'),
argv = require('minimist')(process.argv.slice(2)),
lo = require('lodash'),
jsonStream = require('duplex-json-stream'),
serverHost,
serverPort,
serverName,
clientName;

//Check option arguments
function checkOpts() {
  if ( !lo.has(argv, 'n') || !lo.isString(argv.n) || lo.isEmpty(argv.n) ) {
    console.log("-n [string] client name");
    process.exit(0);
  }

  if ( !lo.has(argv, 's') || !lo.isString(argv.s) || lo.isEmpty(argv.s) ) {
    console.log("-s [string] server to connect to");
    process.exit(0);
  }
}
checkOpts();

//Load client variables
function prepConn() {
  serverName = argv.s || process.env.SERVER_NAME || 'tcp-talk.local';
  serverPort = argv.p || process.env.SERVER_PORT || '8000';
}
prepConn();

var client = net.connect({
  port: serverPort,
  host: serverName
});

client.on('error', onError);
client.on('connect', onConnect);
client.on('end', onEnd);

client = jsonStream(client);

process.stdin.on('data', function (data) {
  client.write({
    user: clientName,
    message: data.toString('utf8')
  });
});

client.on('data', function (data) {
  process.stdout.write("[" + data.user + "] " + data.message);
});

function onError(error) {
	console.error(error);
}

function onConnect() {
	console.log("Connected\r\n");
}

function onEnd() {
  console.log("Connection lost!\r\n");
}
