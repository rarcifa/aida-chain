import { Block } from '@blockchain/Block';

describe('Block', () => {
  let data: any, lastBlock: Block, block: Block;

  beforeEach(() => {
    data = ['data'];
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('should set the data to match the input', () => {
    expect(block.data).toEqual(data);
  });

  it('should set the lastHash to match the hash of the last block ', () => {
    expect(block.prevHash).toEqual(lastBlock.hash);
  });

  it('should generate a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      '0'.repeat(block.difficulty)
    );
  });

  it('should lower the difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(
      block.difficulty - 1
    );
  });

  it('should raises the difficulty for quickly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(
      block.difficulty + 1
    );
  });
});
