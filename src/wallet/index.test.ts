import { IOutput } from '@src/interfaces/transactions';
import { Wallet } from '@wallet/index';
import { TransactionPool } from '@wallet/transaction-pool';
import { Transaction } from './transaction';

describe('Wallet', () => {
  let wallet: Wallet, tp: TransactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe('creating a transaction', () => {
    let transaction: Transaction, sendAmount: number, recipient: Wallet;

    beforeEach(() => {
      sendAmount = 50;
      recipient = new Wallet();
      transaction = wallet.createTransaction(recipient, sendAmount, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      it('doubles the sendAmount subtracted from the wallet balance', () => {
        expect(
          transaction.outputs.find(
            (output: IOutput) => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it('should clone the sendAmount output for the recipient', () => {
        expect(
          transaction.outputs
            .filter((output: IOutput) => output.address === recipient.publicKey)
            .map((output: IOutput) => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
