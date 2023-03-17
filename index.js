require('dotenv').config();
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const appserver = require('./lib/server');
const workers = require('./lib/workers');

const websocketServer = new WebSocket.Server({
  noServer: true,
});

websocketServer.on('connection', function(socket, req, pathname){
  socket.on('message', function(message){
    console.log(message +'\n'+ pathname);
  });
});

var server = {};
server.httpServer = http.createServer(appserver);
server.init = function(){
  server.httpServer.listen(process.env.APP_HTTP_PORT, function(){
    console.log('\x1b[36m%s\x1b[0m','Cekrutebus Server [HTTP] is running in mode - '+ process.env.APP_RUN_MODE +' -, @port: '+process.env.APP_HTTP_PORT);
  });
  server.httpServer.on('upgrade', function(request, socket, head){
    const { pathname } = url.parse(request.url);
    websocketServer.handleUpgrade(request, socket, head, function (websocket){
      websocketServer.emit('connection', websocket, request, pathname);
    });
  });
  workers.init();
};
server.init();
module.exports = server;
