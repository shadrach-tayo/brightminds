import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../../interfaces/auth.interface';
import DB from '../../../database';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // const cookies = req.cookies;
    const authorization: string[] = req.headers['authorization'].split(' ');
    if (authorization[0] === 'Bearer') {
      // return next(new HttpException(404, 'Authentication token missing'))
      const secret = process.env.JWT_SECRET;
      const verificationResponse = (await jwt.verify(authorization[1], secret)) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await DB.Users.findByPk(userId);
      const findAdmin = await DB.Admins.findByPk(userId);
      if (findUser || findAdmin) {
        req.user = findUser || findAdmin;
        next();
      } else {
        next(new HttpException(401, 'Unauthorized access'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    console.log(error);
    next(new HttpException(401, 'Error verifying user'));
  }
};

export default authMiddleware;
