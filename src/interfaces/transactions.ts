import { ec } from 'elliptic';

export interface IOutput {
  amount: number;
  address: string;
}

export interface IInput {
  timestamp: number;
  amount: number;
  address: string;
  signature: ec.Signature;
}
