import { ChainUtil } from '@utils/chain-util';
import { DIFFICULTY, MINE_RATE } from '@config/constants';
import { Transaction } from '@src/wallet/transaction';

/**
 * @summary  represents a block in the AIDAchain.
 * @class
 */
export class Block {
  timestamp: number;
  prevHash: string;
  hash: string;
  data: Transaction[];
  nonce: number;
  difficulty: number;

  /**
   * @summary  creates a new block.
   * @param  {number} timestamp - the timestamp of the block.
   * @param  {string} prevHash - the ash of previous block.
   * @param  {string} hash - the hash of the block.
   * @param  {Transaction[]} data - the data of the block.
   * @param  {number} nonce - the nonce of the block.
   * @param  {number} difficulty - the difficulty of the block.
   */
  constructor(
    timestamp: number,
    prevHash: string,
    hash: string,
    data: Transaction[],
    nonce: number,
    difficulty: number
  ) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  /**
   * @summary  returns a string representation of the block.
   * @returns  {string} a string representation of the block.
   */
  toString(): string {
    return `Block - 
        Timestamp  : ${this.timestamp}
        Last Hash  : ${this.prevHash.substring(0, 10)}
        Hash       : ${this.hash.substring(0, 10)}
        Nonce      : ${this.nonce}
        Difficulty : ${this.difficulty}
        Data       : ${this.data}`;
  }

  /**
   * @summary  returns the genesis block.
   * @returns  {Block} the genesis block.
   */
  static genesis(): Block {
    return new this(
      1677408367128,
      'Genesis Last Hash',
      'Genesis Hash',
      [],
      0,
      DIFFICULTY
    );
  }

  /**
   * @summary  mines a new block.
   * @param  {Block} lastBlock - the last block in the chain.
   * @param  {Transaction[]} data - the data to add to the new block.
   * @returns  {Block} the newly mined block.
   */
  static mineBlock(lastBlock: Block, data: Transaction[]): Block {
    let hash,
      timestamp,
      nonce = 0;
    let { difficulty } = lastBlock;
    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  /**
   * @summary  calculates the hash of the block.
   * @param  {number} timestamp - the timestamp of the block.
   * @param  {string} lastHash - the previous block's hash.
   * @param  {Transaction[]} data - the data of the block.
   * @param  {number} nonce - the nonce of the block.
   * @param  {number} difficulty - the difficulty of the block.
   * @returns  {string} the hash of the block.
   */
  static hash(
    timestamp: number,
    lastHash: string,
    data: Transaction[],
    nonce: number,
    difficulty: number
  ): string {
    return ChainUtil.hash(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  /**
   * @summary  calculates the hash of a block.
   * @param  {Block} block - the block to calculate the hash for.
   * @returns  {string} the hash of the block.
   */
  static blockHash(block: Block): string {
    const { timestamp, prevHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, prevHash, data, nonce, difficulty);
  }

  /**
   * @summary  adjusts the difficulty of mining a new block based on the time taken to mine the previous block.
   * if the time taken is less than the MINE_RATE, then the difficulty is increased by 1.
   * if the time taken is greater than the MINE_RATE, then the difficulty is decreased by 1.
   * @param  {Block} lastBlock - the previous block in the AIDAchain
   * @param  {number} currentTime - the current time in milliseconds
   * @returns  {number} - the adjusted difficulty level
   */
  static adjustDifficulty(lastBlock: Block, currentTime: number): number {
    let { difficulty } = lastBlock;
    difficulty =
      lastBlock.timestamp + MINE_RATE > currentTime
        ? difficulty + 1
        : difficulty - 1;
    return difficulty;
  }
}
