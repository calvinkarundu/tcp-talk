/* @flow */

require('dotenv').load();
var net = require('net'),
streamSet = require('stream-set'),
jsonStream = require('duplex-json-stream'),
host = process.env.HOST || '127.0.0.1',
port = process.env.PORT || '5000',
activeSockets = streamSet();

var server = net.createServer(function (socket) {
  socket = jsonStream(socket);
  activeSockets.add(socket);
  console.log("Connections[" + activeSockets.size + "]");

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
	console.log("Listening on -> " + connInfo.address + ":" + connInfo.port + "\r\n");
}

server.listen({
  host: host,
  port: port
});
