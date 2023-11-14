// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();
const path = require('path');
const cors = require('cors'); // Import the cors middleware

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT , listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(cors({ origin: '*' }));
// Enable CORS for all requests
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });



// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket'],
    credentials: true
  }
});



app.get('/', (req, res) => {
  res.send('Hello, Express with Socket.IO!');
});

io.on('connection', (socket) => {
  console.log('Socket.IO connected');

  socket.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Send the received message to all clients, including the sender
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO disconnected');
  });
});