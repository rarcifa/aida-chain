import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { P2pServer } from '@p2p/p2p-server';
import { Blockchain } from '@blockchain/index';
import { logger } from '@utils/logger';
import { Block } from '@blockchain/block';
import { Wallet } from '@wallet/index';
import { TransactionPool } from '@wallet/transaction-pool';

const app: Express = express();
const bc: Blockchain = new Blockchain();
const wallet: Wallet = new Wallet();
const tp: TransactionPool = new TransactionPool();
const p2pServer: P2pServer = new P2pServer(bc, tp);

app.use(bodyParser.json());

app.get('/blocks', (_req: Request, res: Response) => {
  res.json(bc.chain);
});

app.get('/transactions', (_req: Request, res: Response) => {
  res.json(tp.transactions);
});

app.post('/mine', async (req: Request, res: Response) => {
  const block: Block = bc.addBlock(req.body);
  logger.info(`New block added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect('/blocks');
});

app.post('/createTransaction', (req: Request, res: Response) => {
  const { recipient, amount } = req.body;
  wallet.createTransaction(recipient, amount, tp);
  res.redirect('/transactions');
});

p2pServer.listen();

export default app;
