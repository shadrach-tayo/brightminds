import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { CreateAdminDto, CreateUserDto, LoginUserDto } from '../dtos/users.dto';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../common/middlewares/auth.middleware';
import validationMiddleware from '../common/middlewares/validation.middleware';
import multer from 'multer';

class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();
  public upload = multer();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}/admin/signup`, this.upload.none(), validationMiddleware(CreateAdminDto, 'body'), this.authController.createAdmin);

    this.router.post(
      `${this.path}/admin/login`,
      this.upload.none(),
      validationMiddleware(CreateAdminDto, 'body', true),
      this.authController.logInAdmin,
    );

    this.router.post(`${this.path}/signup`, this.upload.none(), validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);

    this.router.post(`${this.path}/login`, this.upload.none(), validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);

    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
