import SHA256 from 'crypto-js/sha256';

export type Block = {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: string;
};

export const blocks = {
  createBlock: (
    timestamp: number,
    lastHash: string,
    hash: string,
    data: string
  ): Block => ({
    timestamp,
    lastHash,
    hash,
    data,
  }),

  convertToString: (block: Block): string => {
    return `Block - 
                Timestamp: ${block.timestamp}
                Last Hash: ${block.lastHash.substring(0, 10)}
                Hash     : ${block.hash.substring(0, 10)}
                Data     : ${block.data}`;
  },

  genesis: (): Block => {
    return blocks.createBlock(
      1677408367128,
      'Genesis Last Hash',
      'Genesis Hash',
      'Genesis Data'
    );
  },

  mineBlock: (lastBlock: Block, data: string): Block => {
    let hash,
      timestamp,
      nonce = 0;
    const lastHash = lastBlock.hash;
    // proof of work check
    /*     do {
      nonce++;
      hash = blocks.hash(timestamp, lastHash, data);
    } while (hash.substring(0, 6) !== '0'.repeat(6)); */

    return blocks.createBlock(timestamp, lastHash, hash, data);
  },

  hash: (timestamp: number, lastHash: string, data: string): string => {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  },

  blockHash: (block: Block): string => {
    const { timestamp, lastHash, data } = block;
    return blocks.hash(timestamp, lastHash, data);
  },
};
