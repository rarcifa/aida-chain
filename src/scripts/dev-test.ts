import { Blockchain } from '@blockchain/index';
import { logger } from '@helpers/logger';

const blockchain: Blockchain = new Blockchain();

for (let i = 0; i < 10; i++) {
  logger.info(blockchain.addBlock([`foo ${i}`]).toString());
}
