import * as elliptic from 'elliptic';
import SHA256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';
import { IOutput } from '@interfaces/transactions';

const ec: elliptic.ec = new elliptic.ec('secp256k1');

/**
 * @summary  utility class for AIDAchain operations.
 * @class
 */
export class ChainUtil {
  /**
   * @summary  generates a secp256k1 encrypted key pair.
   * @returns  the key pair.
   */
  static genKeyPair(): elliptic.ec.KeyPair {
    return ec.genKeyPair() as elliptic.ec.KeyPair;
  }

  /**
   * @summary  generates a UUID v4 string.
   * @returns  the UUID string.
   */
  static id(): string {
    return uuidv4();
  }

  /**
   * @summary  generates hash from data.
   * @returns  the hashed data.
   */
  static hash(data: string | IOutput[]): string {
    return SHA256(JSON.stringify(data)).toString();
  }

  /**
   * @summary  verify the signature of the provided data hash using the provided public key and signature.
   * @param  {string} publicKey - the public key to verify the signature.
   * @param  {string} signature - the signature to verify.
   * @param  {string} dataHash - the data hash to verify the signature against.
   * @returns  {boolean} returns true if the signature is verified successfully, otherwise false.a.
   */
  static verifySignature(
    publicKey: string,
    signature: elliptic.ec.Signature,
    dataHash: any
  ): boolean {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}
