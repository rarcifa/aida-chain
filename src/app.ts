import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { P2pServer } from '@p2p/p2p-server';
import { AIDAchain } from '@src/blockchain/index';
import { logger } from '@utils/logger';
import { Block } from '@src/blockchain/block';
import { Wallet } from '@wallet/index';
import { TransactionPool } from '@wallet/transaction-pool';
import { Transaction } from '@wallet/transaction';
import { Miner } from '@miner/index';

const app: Express = express();
const bc: AIDAchain = new AIDAchain();
const wallet: Wallet = new Wallet();
const tp: TransactionPool = new TransactionPool();
const p2pServer: P2pServer = new P2pServer(bc, tp);
const miner: Miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (_req: Request, res: Response) => {
  res.json(bc.chain);
});

app.get('/transactions', (_req: Request, res: Response) => {
  res.json(tp.transactions);
});

app.get('/public-key', (_req: Request, res: Response) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get('/mine-transaction', (_req: Request, res: Response) => {
  const block: Block = miner.mine();
  logger.info(`New block added: ${block.toString()}`);
  res.redirect('/blocks');
});

app.post('/mine', async (req: Request, res: Response) => {
  const block: Block = bc.addBlock(req.body);
  logger.info(`New block added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect('/blocks');
});

app.post('/createTransaction', (req: Request, res: Response) => {
  const { recipient, amount } = req.body;
  const transaction: Transaction = wallet.createTransaction(
    recipient,
    amount,
    bc,
    tp
  );
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

p2pServer.listen();

export default app;
