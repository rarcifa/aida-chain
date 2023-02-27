import { Blockchain } from '@blockchain/index';
import { P2P_PORT } from '@config/constants';
import { logger } from '@helpers/logger';
import Websocket from 'ws';

const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];

/**
 * @summary  represents a p2p server instance.
 * @class
 */
export class P2pServer {
  blockchain: Blockchain;
  sockets: Websocket[];

  /**
   * @summary  creates a new p2pserver.
   * @param  {Blockchain} blockchain - the blockchain instance.
   */
  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  /**
   * @summary  starts listening for incoming peer-to-peer connections.
   */
  listen(): void {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', (socket: any) => this.connectSocket(socket));
    this.connectToPeers();
    logger.info(`Listening for peer-to-peer connection on: ${P2P_PORT}`);
  }

  /**
   * @summary  connects to each of the specified peers.
   */
  connectToPeers(): void {
    peers.forEach((peer: string) => {
      // e.g. ws://localhost:5001
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  /**
   * @summary  adds a socket to the sockets array and sets up message and chain synchronization handlers.
   * @param  {Websocket} socket - the socket to connect.
   */
  connectSocket(socket: Websocket): void {
    this.sockets.push(socket);
    logger.info('Socket connected');
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  /**
   * @summary  handles incoming messages from connected sockets.
   * @param  {Websocket} socket - the socket to receive messages from.
   */
  messageHandler(socket: Websocket): void {
    socket.on('message', (message: string) => {
      const data = JSON.parse(message);
      this.blockchain.replaceChain(data);
    });
  }

  /**
   * s@summary  sends the current blockchain chain to a specified socket.
   * @param  {Websocket} socket - the socket to send the chain to.
   */
  sendChain(socket: Websocket): void {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  /**
   * @summary  synchronizes the blockchain chain with all connected sockets.
   */
  syncChains(): void {
    this.sockets.forEach((socket: Websocket) => this.sendChain(socket));
  }
}
