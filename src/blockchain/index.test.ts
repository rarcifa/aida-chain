import { AIDAchain } from '@blockchain/index';
import { Block } from '@blockchain/Block';

describe('AIDAchain', () => {
  let aidachain: AIDAchain, aidachain2: AIDAchain;

  beforeEach(() => {
    aidachain = new AIDAchain();
    aidachain2 = new AIDAchain();
  });

  it('should start with genesis block', () => {
    expect(aidachain.chain[0]).toEqual(Block.genesis());
  });

  it('should add a new block', () => {
    const data: any = ['foo'];
    aidachain.addBlock(data);
    expect(aidachain.chain[aidachain.chain.length - 1].data).toEqual(data);
  });

  it('should validate a valid chain', () => {
    aidachain2.addBlock(['foo'] as any);
    expect(aidachain.isValidChain(aidachain2.chain)).toBe(true);
  });

  it('should invalidate a chain with a corrupt genesis block', () => {
    aidachain2.chain[0].data = ['bad data'] as any;
    expect(aidachain.isValidChain(aidachain2.chain)).toBe(false);
  });

  it('should invalidate a corrupt chain', () => {
    aidachain2.addBlock(['foo'] as any);
    aidachain2.chain[1].data = ['not foo'] as any;
    expect(aidachain.isValidChain(aidachain2.chain)).toBe(false);
  });

  it('should replace the chain with a valid chain', () => {
    aidachain2.addBlock(['foo'] as any);
    aidachain.replaceChain(aidachain2.chain);
    expect(aidachain.chain).toEqual(aidachain2.chain);
  });

  it('should not repalce the chain with one of less than or equal to length', () => {
    aidachain.addBlock(['foo'] as any);
    aidachain.replaceChain(aidachain2.chain);
    expect(aidachain.chain).not.toEqual(aidachain2.chain);
  });
});
