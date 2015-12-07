/* @flow */

require('dotenv').load();
var net = require('net');
var streamSet = require('stream-set');

var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || '5000';
var activeSockets = streamSet();

var server = net.createServer(function (socket) {
  activeSockets.add(socket);
  console.log("connections -> " + activeSockets.size);

  socket.on('data', function (data) {
    activeSockets.forEach(function (soc) {
      if (soc != socket) {
        soc.write(data);
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
