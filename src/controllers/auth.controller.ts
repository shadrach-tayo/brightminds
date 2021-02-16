import { NextFunction, Request, Response } from 'express';
import { CreateAdminDto, CreateUserDto } from '../dtos/users.dto';
import AuthService from '../services/auth.service';
import { Admin } from '../interfaces/domain.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const signUpUserData = await this.authService.signup(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      console.log('error ', error.toString(), error);
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const data = await this.authService.login(userData);
      res.status(200).json({ data, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateAdminDto = req.body;

    try {
      const signUpUserData: Admin = await this.authService.createAdmin(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logInAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateAdminDto = req.body;

    try {
      const data = await this.authService.loginAdmin(userData);
      res.status(200).json({ data, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    // const userData: User = req.user;

    try {
      // const logOutUserData: User = await this.authService.logout();
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: { message: 'logout successful' }, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
