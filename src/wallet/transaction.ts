import { IInput, IOutput } from '@interfaces/transactions';
import { ChainUtil } from '@utils/chain-util';
import { logger } from '@utils/logger';
import { Wallet } from '@wallet/index';
import { MINING_REWARD } from '@config/constants';

/**
 * @summary  transaction class represents a transaction in the AIDAchain.
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
   * @summary  update the transaction by adding a new recipient output and decreasing the sender output amount.
   * @param  {Wallet} senderWallet - the sender's wallet.
   * @param  {string} recipientWallet - the recipient's wallet address.
   * @param  {number} amount - the amount to be transferred.
   * @returns {Transaction}  the updated transaction or undefined if the amount exceeds the sender's balance.
   */
  update(
    senderWallet: Wallet,
    recipientWallet: Wallet,
    amount: number
  ): Transaction {
    const senderOutput: IOutput = this.outputs.find(
      (output: IOutput) => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      logger.error(`Amount: ${amount} exceeds the balance`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({
      amount,
      address: recipientWallet.publicKey,
    });
    Transaction.signTransaction(this, senderWallet);
    return this;
  }

  /**
   * @summary  creates a new transaction with the specified outputs and signs it using the given sender wallet.
   * @param  {Wallet} senderWallet - the wallet to sign the transaction with.
   * @param  {IOutput[]} outputs - the outputs to add to the transaction.
   * @returns  {Transaction} - a new transaction object with the specified outputs, signed by the sender wallet.
   */
  static transactionWithOutputs(
    senderWallet: Wallet,
    outputs: IOutput[]
  ): Transaction {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
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
    if (amount > senderWallet.balance) {
      logger.error(
        `Amount: ${amount} exceeds balance: ${senderWallet.balance}`
      );
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey,
      },
      { amount, address: recipientWallet.publicKey },
    ]);
  }

  /**
   * @summary  creates a new reward transaction with the specified mining reward and miner wallet,
   * and sends the reward to the specified AIDAchain wallet.
   * @param  {Wallet} minerWallet - the wallet of the miner who is receiving the reward.
   * @param  {Wallet} aidachainWallet - the wallet that will receive the mining reward.
   * @returns  {Transaction} - a new transaction object representing the reward transaction.
   */
  static rewardTransaction(
    minerWallet: Wallet,
    aidachainWallet: Wallet
  ): Transaction {
    return Transaction.transactionWithOutputs(aidachainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey,
      },
    ]);
  }

  /**
   * @summary  signs a transaction with the sender's private key.
   * @param  {Transaction} transaction the transaction to be signed.
   * @param  {Wallet} senderWallet the wallet of the sender.
   */
  static signTransaction(transaction: Transaction, senderWallet: Wallet): void {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }

  /**
   * @summary  verifies the signature of a transaction.
   * @param  {Transaction} transaction the transaction to verify.
   * @returns  true if the signature is valid, false otherwise.
   */
  static verifyTransaction(transaction: Transaction): boolean {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}
