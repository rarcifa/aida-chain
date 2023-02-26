import { Block } from "./block";
import { blocks } from "./block";

export class Blockchain {
  chain: Block[];
  constructor() {
    this.chain = [blocks.genesis()];
  }

  addBlock(data: any) {
    const block = blocks.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
    return block;
  }

  isValidChain(chain: any) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(blocks.genesis()))
      return false;

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
  }

  replaceChain(newChain: any) {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer the current chain");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("Received chain is not valid");
      return;
    }

    console.log("Replacing Blockchain with the new chain");
    this.chain = newChain;
  }
}
