/* @flow */

require('dotenv').load();
var net = require('net'),
argv = require('minimist')(process.argv.slice(2)),
lo = require('lodash'),
jsonStream = require('duplex-json-stream'),
serverHost,
serverPort,
clientName;

//Check option arguments
function checkArgs() {
  if ( !lo.has(argv, 'n') || !lo.isString(argv.n) || lo.isEmpty(argv.n) ) {
    console.log("-n [string] client name");
    process.exit(0);
  }
}
checkArgs();

//Load client variables
function prepConn() {
  serverPort = argv.p || process.env.SERVER_PORT;
  serverHost = argv.h || process.env.SERVER_HOST;
  clientName = argv.n;
}
prepConn();

// enable client to work with object stream
var client = jsonStream(
  net.connect({
    port: serverPort,
    host: serverHost
  }, function() {
    console.log("Connected\r\n");
  })
);

client.on('error', onError);
client.on('end', onEnd);
client.on('data', function (data) {
  process.stdout.write("[" + data.user + "] " + data.message);
});

process.stdin.on('data', function (data) {
  //Convert data buffer to string
  var message = data.toString();

  client.write({
    user: clientName,
    message: message
  });
});

function onError(error) {
	console.error(error);
}

function onEnd() {
  console.log("Connection lost!\r\n");
}
