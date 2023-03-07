import { INITIAL_BALANCE } from '@config/constants';
import { logger } from '@utils/logger';
import { ChainUtil } from '@utils/chain-util';
import { BNInput, ec } from 'elliptic';
import { TransactionPool } from '@wallet/transaction-pool';
import { Transaction } from '@wallet/transaction';
import { AIDAchain } from '@src/blockchain';
import { IOutput } from '@src/interfaces/transactions';

/**
 * @summary  represents a wallet that contains a public key and a balance.
 * @class
 */
export class Wallet {
  balance: number;
  keyPair: ec.KeyPair;
  publicKey: string;

  /**
   * @summary  creates a new instance of `Wallet` with an initial balance and a generated key pair.
   */
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex', true);
  }

  /**
   * @summary  returns a string representation of the wallet.
   * @returns  a string containing the public key and the balance of the wallet.
   */
  toString(): string {
    return `Wallet -
        publicKey: ${this.publicKey}
        balance: ${this.balance}`;
  }

  /**
   * @summary  generates a cryptographic signature for the provided data hash using the wallet's private key.
   * @param  {BNInput} dataHash - the hash of the data to sign.
   * @returns  {ec.Signature} a cryptographic signature for the provided data hash.
   */
  sign(dataHash: BNInput): ec.Signature {
    return this.keyPair.sign(dataHash);
  }

  /**
   * @summary  creates a new transaction and adds it to the transaction pool.
   * @param  {Wallet} recipient - the recipient's wallet object.
   * @param  {number} amount - the amount to send in the transaction.
   * @param  {AIDAchain} aidachain - the AIDAchain to generate the transaction.
   * @param  {TransactionPool} transactionPool - The pool of transactions to add the new transaction to.
   * @returns  {Transaction} the newly created transaction object.
   */
  createTransaction(
    recipient: Wallet,
    amount: number,
    aidachain: AIDAchain,
    transactionPool: TransactionPool
  ): Transaction {
    this.balance = this.calculateBalance(aidachain);

    if (amount > this.balance) {
      logger.error(
        `Amount: ${amount} exceeds current balance: ${this.balance}`
      );
      return;
    }
    let tx: Transaction = transactionPool.existingTransaction(this.publicKey);

    if (tx) {
      tx.update(this, recipient, amount);
    } else {
      tx = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(tx);
    }

    return tx;
  }

  /**
   * @summary  calculates the balance of a wallet on the AIDAchain.
   * @param  {AIDAchain} aidachain - the AIDAchain to search for transactions.
   * @returns  {number} the balance of the wallet.
   */
  calculateBalance(aidachain: AIDAchain): number {
    let balance: number = this.balance;
    let transactions: Transaction[] = [];
    let startTime: number = 0;

    aidachain.chain.forEach((block) =>
      block.data.forEach((tx: Transaction) => {
        transactions.push(tx);
      })
    );

    const walletInputTxs: Transaction[] = transactions.filter(
      (tx: Transaction) => tx.input.address === this.publicKey
    );

    if (walletInputTxs.length > 0) {
      const recentInputTx: Transaction = walletInputTxs.reduce(
        (prev: Transaction, current: Transaction) =>
          prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInputTx.outputs.find(
        (output: IOutput) => output.address === this.publicKey
      ).amount;
      startTime = recentInputTx.input.timestamp;
    }

    transactions.forEach((tx: Transaction) => {
      if (tx.input.timestamp > startTime) {
        tx.outputs.find((output: IOutput) => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  /**
   * @summary  creates a new AIDAchain wallet with a default public key.
   * @returns  {Wallet} - a new wallet object representing the AIDAchain wallet.
   */
  static aidachainWallet(): Wallet {
    const AIDAchainWallet = new this();
    AIDAchainWallet.publicKey = 'blocklchain-wallet';
    return AIDAchainWallet;
  }
}
