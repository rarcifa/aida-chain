import { TransactionPool } from '@wallet/transaction-pool';
import { Transaction } from '@wallet/transaction';
import { Wallet } from '@wallet/index';
import { AIDAchain } from '@src/blockchain';

describe('TransactionPool', () => {
  let tp: TransactionPool,
    wallet: Wallet,
    transaction: Transaction,
    bc: AIDAchain;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new AIDAchain();
    transaction = Transaction.newTransaction(wallet, new Wallet(), 30);
    tp.updateOrAddTransaction(transaction);
  });

  it('should add a transaction to the pool', () => {
    expect(
      tp.transactions.find((tx: Transaction) => tx.id === transaction.id)
    ).toBeDefined();
  });

  it('should update a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, new Wallet(), 40);
    tp.updateOrAddTransaction(newTransaction);

    expect(
      JSON.stringify(
        tp.transactions.find((tx: Transaction) => tx.id === newTransaction.id)
      )
    ).not.toEqual(oldTransaction);
  });

  it('should clear transactions', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions: Transaction[];

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction(new Wallet(), 30, bc, tp);
        if (i % 2 == 0) {
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('should show a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(
        JSON.stringify(validTransactions)
      );
    });

    it('should grab valid transactions', () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });
});
