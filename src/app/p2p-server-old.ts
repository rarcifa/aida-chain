import Websocket from "ws";

const P2P_PORT: number = (process.env.P2P_PORT as unknown as number) || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

export class P2pServer {
  blockchain: any;
  sockets: any;
  constructor(blockchain: any) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on("connection", (socket: any) => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer-to-peer connection on: ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach((peer: string) => {
      // e.g. ws://localhost:5001
      const socket = new Websocket(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  connectSocket(socket: any) {
    this.sockets.push(socket);
    console.log("Socket connected");
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket: any) {
    socket.on("message", (message: any) => {
      const data = JSON.parse(message);
      this.blockchain.replaceChain(data);
    });
  }
  // helper function
  sendChain(socket: any) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.forEach((socket: any) => this.sendChain(socket));
  }
}
