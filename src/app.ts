import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { P2pServer } from '@p2p/p2p-server';
import { Blockchain } from '@blockchain/index';
import { logger } from '@src/utils/logger';
import { Block } from '@blockchain/block';

const blockchain: Blockchain = new Blockchain();
const p2pServer: P2pServer = new P2pServer(blockchain);
const app: Express = express();

app.use(bodyParser.json());

app.get('/blocks', (_req: Request, res: Response) => {
  res.json(blockchain.chain);
});

app.post('/mine', async (req: Request, res: Response) => {
  const block: Block = blockchain.addBlock(req.body);
  logger.info(`New block added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect('/blocks');
});

p2pServer.listen();

export default app;
