import { AIDAchain } from '@blockchain/index';
import { P2pServer } from '@p2p/p2p-server';
import { Wallet } from '@wallet/index';
import { TransactionPool } from '@wallet/transaction-pool';
import { Transaction } from '@wallet/transaction';
import { Block } from '@blockchain/block';

/**
 * @summary  miner class that mines new blocks by adding valid transactions from the transaction pool
 * @class
 */
export class Miner {
  aidachain: AIDAchain;
  transactionPool: TransactionPool;
  wallet: Wallet;
  p2pServer: P2pServer;

  /**
   * @summary  create a miner instance
   * @param  {AIDAchain} aidachain - the blockchain object
   * @param  {TransactionPool} transactionPool - the transaction pool object
   * @param  {Wallet} wallet - the wallet object
   * @param  {P2pServer} p2pServer - the peer-to-peer server object
   */
  constructor(
    aidachain: AIDAchain,
    transactionPool: TransactionPool,
    wallet: Wallet,
    p2pServer: P2pServer
  ) {
    this.aidachain = aidachain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  /**
   * @summary  mines a new block by adding valid transactions from the transaction pool,
   * and broadcasts the new block to all miners in the peer-to-peer server
   */
  mine(): Block {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.aidachainWallet())
    );
    const block = this.aidachain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}
