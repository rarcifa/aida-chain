/* import { Blockchain } from '@blockchain/index';
import { logger } from '@src/utils/logger';

const blockchain: Blockchain = new Blockchain();

for (let i = 0; i < 10; i++) {
  logger.info(blockchain.addBlock([`foo ${i}`]).toString());
}
 */

import { Wallet } from '@wallet/index';

const wallet: Wallet = new Wallet();

console.log(wallet.toString());
