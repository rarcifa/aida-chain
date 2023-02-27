import { INITIAL_BALANCE } from '@config/constants';
import { ChainUtil } from '@utils/chain-util';
import { BNInput, ec } from 'elliptic';

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
}
