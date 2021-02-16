import { Request } from 'express';
import { User } from './domain.interface';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
export interface RequestWithFile extends Request {
  user?: User;
  file: any;
}
