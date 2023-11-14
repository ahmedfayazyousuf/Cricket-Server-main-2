//npm install websocket
var WebSocketServer = require('websocket').server;
var http = require('http');
const express = require('express');
const { SerialPort , ReadlineParser} = require('serialport')


const myPort = new SerialPort({ path: 'COM4', baudRate: 9600 })
// these are the definitions for the serial events
myPort.on('open', function() {
    console.log('Serial port opened');
  });

  myPort.on('data', function(data) {
    console.log('Data:', data.toString()); // Assuming the data is in string format
    // connections.forEach((client) => {
      
    //     client.sendUTF(data.toString());
        
    // });
  });

// const app = express();

// // CORS configuration
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Change * to your allowed origins.
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(5000, function() {
    console.log((new Date()) + ' Server is listening on port 5000');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // always verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connections = []; // Initialize an array to hold WebSocket connections


wsServer.on('request', function(request) {
    console.log(request)
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept(null, request.origin)
    console.log((new Date()) + ' Connection accepted.');
    connections.push(connection); // Add the new connection to the array


    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data); this resend the reseived message, instead of it i will send a custom message. hello from nodejs
             // Broadcast the received message to all connected clients (including React.js)
             myPort.on('error', function(err) {
                console.log('Error:', err.message);
              });
              
              // Listen for data from the serial port
              myPort.on('data', function(data) {
                console.log('Data:', data.toString()); // Assuming the data is in string format
                connections.forEach((client) => {
                  
                    client.sendUTF(data.toString());
                    
                });
              });
        connections.forEach((client) => {
            // console.log(client,connection)

            if (client !== connection) {
            client.sendUTF(message.utf8Data);
            }
        });
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });



    connection.on('close', function(reasonCode, description) {
        connections.forEach((client) => {
            console.log(client,connection)

            if (client === connection) {
            client.sendUTF('you are disconnected');
            }
        });
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});