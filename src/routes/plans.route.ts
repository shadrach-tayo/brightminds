import { Router } from 'express';
import UsersController from '../controllers/users.controller';
import Route from '../interfaces/routes.interface';
import multer from 'multer';
import authMiddleware from '../common/middlewares/auth.middleware';
import { CreatePlanDto, CreateSubscriptionDto } from '../dtos/subscriptions.dto';
import validationMiddleware from '../common/middlewares/validation.middleware';
import PlansController from '../controllers/plans.controller';
import permissionMiddleWare from '../common/middlewares/permission.middleware';
import { RESOURCES } from '../common/enum';

class PlansRoute implements Route {
  public path = '/plans';
  public router = Router();
  public upload = multer();
  public usersController = new UsersController();
  public plansController = new PlansController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, permissionMiddleWare.grantAccess('readAny', RESOURCES.PLANS), this.plansController.getPlans); // only admins

    this.router.get(`${this.path}/active`, authMiddleware, this.plansController.getActivePlans); // mobile users

    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      permissionMiddleWare.grantAccess('readAny', RESOURCES.PLANS),
      this.plansController.getPlanById,
    );

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
      `/:id/subscribe`,
      authMiddleware,
      permissionMiddleWare.isSameUserOrAdmin('createOwn', RESOURCES.SUBSCRIPTION),
      // permissionMiddleWare.grantAccess('createOwn', RESOURCES.SUBSCRIPTION),
      validationMiddleware(CreateSubscriptionDto, 'body'),
      this.plansController.subscribe,
    );

    this.router.post(
      `${this.path}`,
      authMiddleware,
      this.upload.none(),
      validationMiddleware(CreatePlanDto, 'body'),
      this.plansController.createPlan,
    );

    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      this.upload.none(),
      validationMiddleware(CreatePlanDto, 'body', true),
      this.plansController.updatePlan,
    );

    this.router.delete(`${this.path}/:id`, authMiddleware, this.plansController.deleteUser);
  }
}

export default PlansRoute;
