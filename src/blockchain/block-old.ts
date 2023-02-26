import SHA256 from "crypto-js/sha256";

export class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: string;
  constructor(timestamp: number, lastHash: string, hash: string, data: string) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block - 
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lastHash.substring(0, 10)}
        Hash     : ${this.hash.substring(0, 10)}
        Data     : ${this.data}`;
  }

  static genesis() {
    return new this(
      1677408367128,
      "Genesis Last Hash",
      "Genesis Hash",
      "Genesis Data"
    );
  }

  static mineBlock(lastBlock: Block, data: string) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);

    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp: number, lastHash: string, data: string) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }

  static blockHash(block: Block) {
    const { timestamp, lastHash, data } = block;
    return Block.hash(timestamp, lastHash, data);
  }
}
