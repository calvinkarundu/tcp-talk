/* @flow */

require('dotenv').load();
var net = require('net'),
lo = require('lodash'),
argv = require('minimist')(process.argv.slice(2)),
jsonStream = require('duplex-json-stream'),
host = process.env.HOST || '127.0.0.1',
port = process.env.PORT || '5000',
clientName;

ensureOpts(argv);
clientName = argv.u;

var client = net.connect({
  port: port,
  host: host
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
  process.stdout.write(data.user + "> " + data.message);
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

function ensureOpts(opts) {
  if ( !lo.has(opts, 'u') ) {
    console.log("-u [string] client name");
    process.exit(1);
  }

  if ( lo.isEmpty(opts.u) ) {
    console.log("-u [string] client name");
    process.exit(1);
  }
}
