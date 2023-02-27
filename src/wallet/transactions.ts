import { IInput, IOutput } from '@interfaces/transactions';
import { ChainUtil } from '@utils/chain-util';
import { logger } from '@utils/logger';
import { Wallet } from '@wallet/index';

/**
 * @summary  transaction class represents a transaction in the blockchain.
 * @class
 */
export class Transaction {
  id: string;
  input: IInput;
  outputs: IOutput[];

  /**
   * @summary  constructor for creating a new transaction.
   */
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  /**
   * @summary  creates a new transaction.
   * @param  {Wallet} senderWallet the wallet of the sender.
   * @param  {Wallet} recipientWallet the wallet of the recipient.
   * @param  {number} amount the amount to be transferred.
   * @returns  the newly created transaction or undefined if the amount exceeds the sender's balance.
   */
  static newTransaction(
    senderWallet: Wallet,
    recipientWallet: Wallet,
    amount: number
  ): Transaction {
    const transaction: Transaction = new this();
    if (amount > senderWallet.balance) {
      logger.error(
        `Amount: ${amount} exceeds balance: ${senderWallet.balance}`
      );
      return;
    }
    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey,
        },
        { amount, address: recipientWallet.publicKey },
      ]
    );
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static signTransaction(transaction: Transaction, senderWallet: Wallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }
}
