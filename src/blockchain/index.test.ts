/* import { blockchain, Blockchain } from '../blockchain';
import { blocks } from '../blockchain/block';

describe('Blockchain', () => {
    let blockchain1: any, blockchain2: any;

  beforeEach(() => {
    blockchain1 = blockchain;
    blockchain2 = blockchain;
  });

  it('should start with genesis block', () => {
    const chain = blockchain1.createBlockchain().chain;
    expect(chain[0]).toEqual(blocks.genesis());
  });

  it('should add a new block', () => {
    const data = 'foo';
    blockchain1.addBlock(data);
    expect(Blockchain[Blockchain.length - 1].data).toEqual(data);
  });

  it('should validate a valid chain', () => {
    const data = 'foo';
    blockchain1.addBlock(data);

    expect(blockchain1.isValidChain(Blockchain)).toBe(true);
  });

  it('should invalidate a chain with corrupt genesis block', () => {
    const invalidGenesis = [
      {
        timestamp: 1677408367128,
        lastHash: 'Genesis Last Hash',
        hash: 'Genesis Hash',
        data: 'Invalid Genesis Data',
        nonce: 0,
      },
    ];
    expect(blockchain1.isValidChain(invalidGenesis)).toBe(false);
  }); */
/*   it('should invalidate a corrupt chain', () => {
    const data = 'foo';
    blockchain2.addBlock(data);
    const invalidBlock = [
      {
        timestamp: 1677408367128,
        lastHash: 'Genesis Last Hash',
        hash: 'Genesis Hash',
        data: 'not foo',
        nonce: 0,
      },
    ];
    expect(blockchain2.isValidChain(invalidBlock)).toBe(false);
  }); */
/*   it("should replace the chain with a valid chain", () => {
    blockchain2.addBlock("goo");

    blockchain.replaceChain(blockchain2.chain);
    expect(blockchain.chain).toEqual(blockchain2.chain);
  }); */
/*   it("should not replace the chain with one of less then or equal to the length", () => {
    blockchain.addBlock("foo");
    blockchain.replaceChain(blockchain2.chain);

    expect(blockchain.chain).not.toEqual(blockchain2.chain);
  }); 
});
 */
