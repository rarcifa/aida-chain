import express, { Router } from 'express';

// misc
export const DIFFICULTY = 3;
export const MINE_RATE = 3000;

// default
export const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 3001;
export const P2P_PORT: number = Number(process.env.P2P_PORT) || 5001;
export const IS_PROD_ENV: boolean = process.env.NODE_ENV === 'production';
export const IS_DEV_ENV: boolean = process.env.NODE_ENV === 'development';

// router
export const blockchainRouter: Router = express.Router();
