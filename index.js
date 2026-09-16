const WebSocket = require('ws');
const net = require('net');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`Proxy pipeline listening on port ${PORT}`);
});

wss.on('connection', (ws) => {
    console.log('Incoming client request. Tunneling packet stream...');
    
    // Connects directly to your FalixNodes target port
    const client = net.connect(20972, 'riverwoodserver.falix.gg', () => {
        console.log('Backend channel established.');
    });

    ws.on('message', (message) => {
        client.write(message);
    });

    client.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    ws.on('close', () => {
        client.end();
    });

    client.on('close', () => {
        ws.close();
    });

    ws.on('error', () => { ws.close(); });
    client.on('error', () => { client.end(); });
});
