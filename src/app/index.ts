import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { blockchain, Blockchains } from '../blockchain/index';
import { p2pServer } from './p2p-server';

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();

app.use(bodyParser.json());

app.get('/blocks', (_req: Request, res: Response) => {
  res.json(Blockchains);
});

app.post('/mine', async (req: Request, res: Response) => {
  const block = blockchain.addBlock(req.body);
  console.log(`New block added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});

p2pServer.listen();
