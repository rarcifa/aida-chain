import { Block } from '@blockchain/block';
import { Transaction } from '@src/wallet/transaction';
import { logger } from '@utils/logger';

/**
 * @summary  represents an AIDAchain instance.
 * @class
 */
export class AIDAchain {
  chain: Block[];

  /**
   * @summary  creates a new AIDAchain instance.
   */
  constructor() {
    this.chain = [Block.genesis()];
  }

  /**
   * @summary  adds a new block to the AIDAchain.
   * @param  {Transaction[]} data - the data to be included in the new block.
   * @returns  {Block} the new block that was added to the AIDAchain.
   */
  addBlock(data: Transaction[]): Block {
    const block: Block = Block.mineBlock(
      this.chain[this.chain.length - 1],
      data
    );
    this.chain.push(block);
    return block;
  }

  /**
   * @summary  checks whether a given chain is a valid chain for the AIDAchain.
   * @param  {Block[]} chain - the chain to be validated.
   * @returns  {boolean} `true` if the chain is valid, otherwise `false`.
   */
  isValidChain(chain: Block[]): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (
        block.prevHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * @summary  replaces the current chain with a new chain, if the new chain is longer and valid.
   * @param  {Block[]} newChain - the new chain to replace the current chain.
   */
  replaceChain(newChain: Block[]): void {
    if (newChain.length <= this.chain.length) {
      logger.info('Received chain is not longer the current chain');
      return;
    } else if (!this.isValidChain(newChain)) {
      logger.info('Received chain is not valid');
      return;
    }

    logger.info('Replacing current chain with the new chain');
    this.chain = newChain;
  }
}
