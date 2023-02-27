import { Transaction } from '@wallet/transactions';
import { Wallet } from '@wallet/index';

describe('Transaction', () => {
  let transaction: Transaction,
    senderWallet: Wallet,
    recepientWallet: Wallet,
    amount: number;

  beforeEach(() => {
    senderWallet = new Wallet();
    amount = 50;
    recepientWallet = new Wallet();
    transaction = Transaction.newTransaction(
      senderWallet,
      recepientWallet,
      amount
    );
  });

  it('should output the amount subtracted from the wallet balance', () => {
    expect(
      transaction.outputs.find(
        (output) => output.address === senderWallet.publicKey
      ).amount
    ).toEqual(senderWallet.balance - amount);
  });

  it('should output the amount added to the recipient', () => {
    expect(
      transaction.outputs.find(
        (output) => output.address === recepientWallet.publicKey
      ).amount
    ).toEqual(amount);
  });

  it('should input the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(senderWallet.balance);
  });

  it('should validate a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it('should invalidate a corrupt transaction', () => {
    transaction.outputs[0].amount = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(
        senderWallet,
        recepientWallet,
        amount
      );
    });

    it('should not create the transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });

  describe('updating a transaction', () => {
    let nextAmount: number, nextRecipient: Wallet;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = new Wallet();
      transaction = transaction.update(senderWallet, nextRecipient, nextAmount);
    });

    it('should subtract the next amount from the senders output', () => {
      expect(
        transaction.outputs.find(
          (output) => output.address === senderWallet.publicKey
        ).amount
      ).toEqual(senderWallet.balance - amount - nextAmount);
    });

    it('should output an amount for the next recipient', () => {
      expect(
        transaction.outputs.find(
          (output) => output.address === nextRecipient.publicKey
        ).amount
      ).toEqual(nextAmount);
    });
  });
});
