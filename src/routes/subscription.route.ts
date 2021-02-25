import { Router } from 'express';
import UsersController from '../controllers/users.controller';
import Route from '../interfaces/routes.interface';
import multer from 'multer';
import authMiddleware from '../common/middlewares/auth.middleware';
import { CreateSubscriptionDto } from '../dtos/subscriptions.dto';
import validationMiddleware from '../common/middlewares/validation.middleware';
import PlansController from '../controllers/plans.controller';
import permissionMiddleWare from '../common/middlewares/permission.middleware';
import { RESOURCES } from '../common/enum';

class SubscriptionRoute implements Route {
  public path = '/subscriptions';
  public router = Router();
  public upload = multer();
  public usersController = new UsersController();
  public plansController = new PlansController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/get-subscription`,
      authMiddleware,
      permissionMiddleWare.grantAccess('readOwn', RESOURCES.SUBSCRIPTION),
      this.plansController.getUserSubscription,
    ); // on admins

    this.router.get(
      `${this.path}/get-subscriptions`,
      authMiddleware,
      permissionMiddleWare.grantAccess('readAny', RESOURCES.SUBSCRIPTION),
      this.plansController.getUserSubscriptions,
    );

    this.router.post(
      `${this.path}/subscribe`,
      authMiddleware,
      this.upload.none(),
      // permissionMiddleWare.isSameUserOrAdmin('createOwn', RESOURCES.SUBSCRIPTION),
      permissionMiddleWare.grantAccess('createOwn', RESOURCES.SUBSCRIPTION),
      validationMiddleware(CreateSubscriptionDto, 'body'),
      this.plansController.subscribe,
    );

    // this.router.put(
    //   `${this.path}/:id`,
    //   authMiddleware,
    //   this.upload.none(),
    //   validationMiddleware(CreatePlanDto, 'body', true),
    //   this.plansController.updatePlan,
    // );

    this.router.delete(`${this.path}/:id`, authMiddleware, this.plansController.deleteSubscription);
  }
}

export default SubscriptionRoute;
