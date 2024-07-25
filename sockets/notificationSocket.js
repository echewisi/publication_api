const WebSocket = require('ws');

const clients = new Set();

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected');
    });
  });

  const notifyClients = (message) => {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  return {
    notifyClients
  };
};

module.exports = setupWebSocket;
