import { Block, blocks } from './block';

export type Blockchain = {
  chain: Block[];
};

export const blockchain = {
  createBlockchain: (): Blockchain => {
    const chain = [blocks.genesis()];
    return { chain };
  },

  addBlock: (data: string): Block => {
    const block = blocks.mineBlock(blockchain.getLastBlock(Blockchains), data);
    Blockchains.push(block);
    return block;
  },

  isValidChain: (chain: Block[]): boolean => {
    if (JSON.stringify(chain[0]) !== JSON.stringify(blocks.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== blocks.blockHash(block)
      ) {
        return false;
      }
    }

    return true;
  },

  replaceChain: (newChain: Block[]): void => {
    if (newChain.length <= Blockchains.length) {
      console.log('Received chain is not longer the current chain');
      return;
    } else if (!blockchain.isValidChain(newChain)) {
      console.log('Received chain is not valid');
      return;
    }
    console.log('Replacing Blockchain with the new chain');
    blockchain.createBlockchain().chain = newChain;
  },

  getLastBlock: (chain: Block[]): Block => {
    return chain[chain.length - 1];
  },
};

export const Blockchains = blockchain.createBlockchain().chain;
