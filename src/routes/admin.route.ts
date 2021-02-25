import { Router } from 'express';
import UsersController from '../controllers/users.controller';
import Route from '../interfaces/routes.interface';
import multer, { FileFilterCallback } from 'multer';
import authMiddleware from '../common/middlewares/auth.middleware';
import HttpException from '../exceptions/HttpException';
import { RESOURCES } from '../common/enum';
import permissionMiddleWare from '../common/middlewares/permission.middleware';
import { AdminCreateSubscriptionDto } from '../dtos/subscriptions.dto';
import validationMiddleware from '../common/middlewares/validation.middleware';
import PlansController from '../controllers/plans.controller';

class AdminRoute implements Route {
  public path = '/admin';
  public router = Router();
  public FILE_SIZE_LIMIT = 1 * 1024 * 1024;
  public usersController = new UsersController();
  public plansController = new PlansController();
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
    // this.router.post(`${this.path}/upload-avatar`, authMiddleware, this.upload.single('avatar'), this.usersController.uploadUserAvater); // isSameUserOrCanEdit

    this.router.post(
      `${this.path}/subscribe`,
      authMiddleware,
      this.upload.none(),
      permissionMiddleWare.grantAccess('createAny', RESOURCES.SUBSCRIPTION),
      validationMiddleware(AdminCreateSubscriptionDto, 'body'),
      this.plansController.subscribeUser,
    );
  }
}

export default AdminRoute;
