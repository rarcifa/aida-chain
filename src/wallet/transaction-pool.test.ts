import { TransactionPool } from '@wallet/transaction-pool';
import { Transaction } from '@src/wallet/transaction';
import { Wallet } from '@src/wallet/index';

describe('TransactionPool', () => {
  let tp: TransactionPool, wallet: Wallet, transaction: Transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, new Wallet(), 30);
    tp.updateOrAddTransaction(transaction);
  });

  it('should add a transaction to the pool', () => {
    expect(
      tp.transactions.find((t: Transaction) => t.id === transaction.id)
    ).toBeDefined();
  });

  it('should update a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, new Wallet(), 40);
    tp.updateOrAddTransaction(newTransaction);

    expect(
      JSON.stringify(
        tp.transactions.find((t: Transaction) => t.id === newTransaction.id)
      )
    ).not.toEqual(oldTransaction);
  });
});
