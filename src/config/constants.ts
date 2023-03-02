// misc
export const DIFFICULTY: number = 3;
export const MINE_RATE: number = 3000;
export const INITIAL_BALANCE: number = 500;
export const MINING_REWARD: number = 50;

// default
export const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 3001;
export const P2P_PORT: number = Number(process.env.P2P_PORT) || 5001;
export const IS_PROD_ENV: boolean = process.env.NODE_ENV === 'production';
export const IS_DEV_ENV: boolean = process.env.NODE_ENV === 'development';
export const MESSAGE_TYPES: {
  chain: string;
  transaction: string;
  clear_transactions: string;
} = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS',
};
