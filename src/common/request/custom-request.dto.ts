import { Request } from 'express';

export class CustomRequest extends Request {
  casas: number[];
  delegaciones: number[];
}
