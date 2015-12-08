/* @flow */

require('dotenv').load();
var net = require('net'),
argv = require('minimist')(process.argv.slice(2)),
lo = require('lodash'),
register = require('register-multicast-dns'),
streamSet = require('stream-set'),
jsonStream = require('duplex-json-stream'),
serverHost,
serverPort,
serverName,
activeSockets = streamSet();

//Check option arguments
function ensureOpts() {
  // if ( !lo.has(argv, 's') || !lo.isString(argv.s) || lo.isEmpty(argv.s) ) {
  //   console.log("-s [string] server name");
  //   process.exit(1);
  // }
}
ensureOpts();

//Load server variables
function prepConn() {
  serverHost = argv.h || process.env.SERVER_HOST || '127.0.0.1';
  serverPort = argv.p || process.env.SERVER_PORT || '8000';
  serverName = argv.s || process.env.SERVER_NAME || 'tcp-talk.local';
  register(serverName);
}
prepConn();

var server = net.createServer(function (socket) {
  socket = jsonStream(socket);

  activeSockets.add(socket);
  console.log("Connections[" + activeSockets.size + "]");

  var receivingSockets = activeSockets.streams;
  console.log(receivingSockets);
  activeSockets.remove(socket);
  console.log(receivingSockets);
  process.exit(0);

  socket.on('data', function (data) {
    activeSockets.forEach(function (soc) {
      if (soc != socket) {
        soc.write({
          user: data.user,
          message: data.message
        });
      }
    });
  });
});

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
	console.error(error);
}

function onListening() {
  var connInfo = server.address();
	console.log("Server address -> " + connInfo.address + ":" + connInfo.port + "\r\n");
  console.log("Server name -> " + serverName);
}

server.listen({
  host: serverHost,
  port: serverPort
});
