import { IOutput } from '@interfaces/transactions';
import { logger } from '@utils/logger';
import { Transaction } from '@wallet/transaction';

/**
 * @summary  Class representing a pool of transactions.
 * @class
 */
export class TransactionPool {
  transactions: Transaction[];

  /**
   * @summary  creates a new TransactionPool instance.
   */
  constructor() {
    this.transactions = [];
  }

  /**
   * @summary  adds a new transaction to the pool, or updates an existing one if it already exists.
   * @param  {Transaction} transaction - The transaction to add or update.
   */
  updateOrAddTransaction(transaction: Transaction): void {
    let transactionWithId: Transaction = this.transactions.find(
      (t) => t.id === transaction.id
    );

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] =
        transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  /**
   * @summary  returns an existing transaction from the wallet's transaction pool.
   * @param  {string} address - The address associated with the transaction to find.
   * @returns  {Transaction} The existing transaction object with the given address, or undefined if not found.
   */
  existingTransaction(address: string): Transaction {
    return this.transactions.find(
      (tx: Transaction) => tx.input.address === address
    );
  }

  /**
   * @summary  returns an array of valid transactions by filtering out any transactions
   * that have an invalid output total or an invalid signature.
   * @returns  {Transaction[]} an array of valid transactions
   */
  validTransactions(): Transaction[] {
    return this.transactions.filter((tx: Transaction) => {
      const outputTotal: number = tx.outputs.reduce(
        (total: number, output: IOutput) => {
          return total + output.amount;
        },
        0
      );

      if (tx.input.amount !== outputTotal) {
        logger.error(`Invalid transaction from ${tx.input.address}`);
        return;
      }

      if (!Transaction.verifyTransaction(tx)) {
        logger.error(`Invalid signature from ${tx.input.address}`);
        return;
      }

      return tx;
    });
  }

  /**
   * @summary  clears the transactionPool
   */
  clear(): void {
    this.transactions = [];
  }
}
