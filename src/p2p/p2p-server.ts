import { AIDAchain } from '@blockchain/index';
import { MESSAGE_TYPES, P2P_PORT } from '@config/constants';
import { Transaction } from '@wallet/transaction';
import { logger } from '@utils/logger';
import { TransactionPool } from '@wallet/transaction-pool';
import Websocket from 'ws';

const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];

/**
 * @summary  represents a p2p server instance.
 * @class
 */
export class P2pServer {
  aidachain: AIDAchain;
  transactionPool: TransactionPool;
  sockets: Websocket[];

  /**
   * @summary  creates a new p2pserver.
   * @param  {AIDAchain} aidachain - the AIDAchain instance.
   * @param  {TransactionPool} transactionPool - the transactionPool instance.
   */
  constructor(aidachain: AIDAchain, transactionPool: TransactionPool) {
    this.aidachain = aidachain;
    this.transactionPool = transactionPool;
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
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.aidachain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
    });
  }

  /**
   * s@summary  sends the current chain to a specified socket.
   * @param  {Websocket} socket - the socket to send the chain to.
   */
  sendChain(socket: Websocket): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.aidachain.chain,
      })
    );
  }

  /**
   * @summary  sends a transaction to the specified WebSocket connection.
   * @param  {Websocket} socket - the WebSocket connection to send the transaction to.
   * @param  {Transaction} transaction - the transaction to send.
   */
  sendTransaction(socket: Websocket, transaction: Transaction): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction: transaction,
      })
    );
  }

  /**
   * @summary  synchronizes the chain with all connected sockets.
   */
  syncChains(): void {
    this.sockets.forEach((socket: Websocket) => this.sendChain(socket));
  }

  /**
   * @summary  broadcasts a transaction to all connected WebSocket clients.
   * @param  {Transaction} transaction - the transaction to broadcast.
   */
  broadcastTransaction(transaction: Transaction): void {
    this.sockets.forEach((socket) => this.sendTransaction(socket, transaction));
  }

  /**
   * @summary  broadcasts clear transactios message to all connected WebSocket clients
   */
  broadcastClearTransactions(): void {
    this.sockets.forEach((socket) =>
      socket.send(JSON.stringify({ type: MESSAGE_TYPES.clear_transactions }))
    );
  }
}
