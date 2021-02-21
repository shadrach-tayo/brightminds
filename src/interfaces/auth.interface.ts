import { Request } from 'express';
import { Admin, User } from './domain.interface';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User | Admin;
  admin: Admin;
}
export interface RequestWithFile extends Request {
  user?: User;
  file: any;
}
