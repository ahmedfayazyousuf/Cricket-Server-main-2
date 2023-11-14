const WebSocketServer = require('websocket').server;
const http = require('http');


// HTTP server setup
const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen( process.env.PORT, function() {
    console.log((new Date()) + ' Server is listening on port 5000');
});

// WebSocket server setup
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

const connections = []; // Array to hold WebSocket connections

function originIsAllowed(origin) {
    // Put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    const connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connections.push(connection);

    connection.on('message', function(message) {
        // Handle WebSocket messages if needed
        
    // Send data to all connected WebSocket clients
    connections.forEach((client) => {
    client.sendUTF(message.utf8Data);
    });
    });

    connection.on('close', function(reasonCode, description) {
        // Handle WebSocket connection close if needed
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        // Remove the disconnected client from the array
        const index = connections.indexOf(connection);  
        if (index !== -1) {
            connections.splice(index, 1);
        }
    });
});
