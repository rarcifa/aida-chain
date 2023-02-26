import Websocket from 'ws';
import { blockchain, Blockchains } from '../blockchain/index';

const P2P_PORT: number = (process.env.P2P_PORT as unknown as number) || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

export const p2pServer = {
  listen: () => {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', (socket: Websocket.WebSocket) =>
      p2pServer.connectSocket(socket)
    );
    p2pServer.connectToPeers();
    console.log(`Listening for peer-to-peer connection on: ${P2P_PORT}`);
  },

  connectToPeers: () => {
    peers.forEach((peer: string) => {
      // e.g. ws://localhost:5001
      const socket = new Websocket(peer);
      socket.on('open', () => p2pServer.connectSocket(socket));
    });
  },

  connectSocket: (socket: Websocket.WebSocket) => {
    sockets.push(socket);
    console.log('Socket connected');
    p2pServer.messageHandler(socket);
    p2pServer.sendChain(socket);
  },

  messageHandler: (socket: Websocket.WebSocket) => {
    socket.on('message', (message: string) => {
      const data = JSON.parse(message);
      blockchain.replaceChain(data);
    });
  },

  // helper function
  sendChain: (socket: Websocket.WebSocket) => {
    socket.send(JSON.stringify(Blockchains));
  },

  syncChains: () => {
    sockets.forEach((socket: Websocket.WebSocket) =>
      p2pServer.sendChain(socket)
    );
  },
};

export const sockets: Websocket.WebSocket[] = [];
