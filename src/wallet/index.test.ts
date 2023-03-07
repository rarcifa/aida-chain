import { IOutput } from '@interfaces/transactions';
import { Wallet } from '@wallet/index';
import { TransactionPool } from '@wallet/transaction-pool';
import { Transaction } from '@wallet/transaction';
import { INITIAL_BALANCE, MINING_REWARD } from '@config/constants';
import { AIDAchain } from '@blockchain/index';

describe('Wallet', () => {
  let wallet: Wallet, tp: TransactionPool, bc: AIDAchain;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new AIDAchain();
  });

  describe('creating a transaction', () => {
    let transaction: Transaction, sendAmount: number, recipient: Wallet;

    beforeEach(() => {
      sendAmount = 50;
      recipient = new Wallet();
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tp);
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
  describe('creating a reward transaction', () => {
    let transaction: Transaction;

    beforeEach(() => {
      transaction = Transaction.rewardTransaction(
        wallet,
        Wallet.aidachainWallet()
      );
    });

    it('should reward the miner', () => {
      expect(
        transaction.outputs.find(
          (output: IOutput) => output.address === wallet.publicKey
        ).amount
      ).toEqual(MINING_REWARD);
    });
  });

  describe('calculating a balance', () => {
    let addBalance: number, repeatAdd: number, senderWallet: Wallet;

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet, addBalance, bc, tp);
      }
      bc.addBlock(tp.transactions);
    });

    it('should calculate the balance for AIDAchain transactions matchint the recipient', () => {
      expect(wallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE + addBalance * repeatAdd
      );
    });

    it('calculates the balance for blockchain transactions matchin the sender', () => {
      expect(senderWallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE - addBalance * repeatAdd
      );
    });

    describe('and the recipient conducts a transaction', () => {
      let subtractBalance: number, recipientBalance: number;

      beforeEach(() => {
        tp.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(bc);
        wallet.createTransaction(senderWallet, subtractBalance, bc, tp);
        bc.addBlock(tp.transactions);
      });

      describe('and the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          tp.clear();
          senderWallet.createTransaction(wallet, addBalance, bc, tp);
          bc.addBlock(tp.transactions);
        });

        it('should calculate the recipient balance only using transactions since its most recent one', () => {
          expect(wallet.calculateBalance(bc)).toEqual(
            recipientBalance - subtractBalance + addBalance
          );
        });
      });
    });
  });
});
