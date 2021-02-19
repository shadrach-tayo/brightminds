import { Router } from 'express';
import UsersController from '../controllers/users.controller';
import Route from '../interfaces/routes.interface';
import multer, { FileFilterCallback } from 'multer';
import authMiddleware from '../common/middlewares/auth.middleware';
import HttpException from '../exceptions/HttpException';
class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public FILE_SIZE_LIMIT = 1 * 1024 * 1024;
  public usersController = new UsersController();
  public upload = multer({
    dest: 'temp/',
    limits: { fieldSize: this.FILE_SIZE_LIMIT },
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new HttpException(400, 'Only .png, .jpg and .jpeg format allowed!'));
      }
    },
  }); // dynamically set image limits

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload-avatar`, authMiddleware, this.upload.single('avatar'), this.usersController.uploadUserAvater); // isSameUserOrCanEdit
    // this.router.get(`${this.path}`, this.usersController.getUsers);
    // this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    // this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}

export default UsersRoute;
