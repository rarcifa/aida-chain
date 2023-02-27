import { Blockchain } from '@blockchain/index';
import { Block } from '@blockchain/Block';

describe('Blockchain', () => {
  let blockchain: Blockchain, blockchain2: Blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  it('should start with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('should add a new block', () => {
    const data = ['foo'];
    blockchain.addBlock(data);
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  it('should validate a valid chain', () => {
    blockchain2.addBlock(['foo']);
    expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });

  it('should invalidate a chain with a corrupt genesis block', () => {
    blockchain2.chain[0].data = ['bad data'];
    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it('should invalidate a corrupt chain', () => {
    blockchain2.addBlock(['foo']);
    blockchain2.chain[1].data = ['not foo'];
    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it('should replace the chain with a valid chain', () => {
    blockchain2.addBlock(['foo']);
    blockchain.replaceChain(blockchain2.chain);
    expect(blockchain.chain).toEqual(blockchain2.chain);
  });

  it('should not repalce the chain with one of less than or equal to length', () => {
    blockchain.addBlock(['foo']);
    blockchain.replaceChain(blockchain2.chain);
    expect(blockchain.chain).not.toEqual(blockchain2.chain);
  });
});
