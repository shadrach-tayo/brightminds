import { Router } from 'express';
import UsersController from '../controllers/users.controller';
// import { CreateUserDto } from '../dtos/users.dto';
import Route from '../interfaces/routes.interface';
// import validationMiddleware from '../common/middlewares/validation.middleware';
import multer from 'multer';
import authMiddleware from '../common/middlewares/auth.middleware';
class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();
  public upload = multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }); // dynamically set image limits

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload-avatar`, authMiddleware, this.upload.single('avatar'), this.usersController.uploadUserAvater);
    // this.router.get(`${this.path}`, this.usersController.getUsers);
    // this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}

export default UsersRoute;
