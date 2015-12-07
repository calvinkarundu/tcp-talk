/* @flow */

require('dotenv').load();
var net = require('net');
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || '5000';

var server = net.createServer(function (socket) {
  console.log("new connection");

  socket.on('data', function (data) {
    socket.write(data);
  });
});

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
	console.error(error);
}

function onListening() {
  var connInfo = server.address();
	console.log("Listening on -> " + connInfo.address + ":" + connInfo.port);
}

server.listen({
  host: host,
  port: port
});
