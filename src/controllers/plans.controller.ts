import { NextFunction, Request, Response } from 'express';
import { AdminCreateSubscriptionDto, AdminUpdateSubscriptionDto, CreatePlanDto, CreateSubscriptionDto } from '../dtos/subscriptions.dto';
// import { CreateUserDto } from '../dtos/users.dto';
import { RequestWithUser } from '../interfaces/auth.interface';
import { Plan, Subscription } from '../interfaces/domain.interface';
import PlanService from '../services/plans.service';
import UploadService from '../services/upload.service';
import UserService from '../services/users.service';

class PlansController {
  public userService = new UserService();
  public planService = new PlanService();
  public uploadService = new UploadService();

  public getPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Plan[] = await this.planService.findAllPlans();
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public getSubcribedUsers = async (req: Request, res: Response, next: NextFunction) => {
    const planId = req.params.id;
    try {
      const data: Subscription[] = await this.planService.getSubscribedUsers(planId);
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public getActivePlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Plan[] = await this.planService.findActivePlans();
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public getPlanById = async (req: Request, res: Response, next: NextFunction) => {
    const planId = req.params.id;

    try {
      const data: Plan = await this.planService.findPlanById(planId);
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public createPlan = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreatePlanDto = req.body;

    try {
      const data: Plan = await this.planService.createPlan(userData);
      res.status(201).json({ data, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public subscribe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const subData: CreateSubscriptionDto = req.body;
    const userId: string = req.user.id;
    console.log('user id ', userId);

    try {
      const data: Subscription = await this.planService.subscribe(userId, subData);
      res.status(201).json({ data, message: 'success' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  public subscribeUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const subData: AdminCreateSubscriptionDto = req.body;
    const userId: string = subData.userId;
    console.log('user id ', userId);

    try {
      const data: Subscription = await this.planService.subscribeUser(userId, subData);
      res.status(201).json({ data, message: 'success' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public getUserSubscription = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId: string = req.user.id;

    try {
      const data: Subscription = await this.planService.getSubscription(userId);
      res.status(201).json({ data, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public getUserSubscriptions = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const data: Subscription[] = await this.planService.getSubscriptions();
      res.status(201).json({ data, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public updateSubscription = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId: string = req.params.id;
    const subData: AdminUpdateSubscriptionDto = req.body;
    try {
      const data: Subscription = await this.planService.updateUserSubscription(userId, subData);
      res.status(201).json({ data, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    const Id = req.params.id;
    const planData: Plan = req.body;

    try {
      const data: Plan = await this.planService.updatePlan(Id, planData);
      res.status(200).json({ data, message: 'Plan successfully updated' });
    } catch (error) {
      next(error);
    }
  };

  // public uploadUserAvater = async (req: RequestWithFile, res: Response, next: NextFunction) => {
  //   const userId = req.user.id;
  //   const avatarFile = req.file;

  //   try {
  //     const updateUserData = await this.uploadService.uploadUserAvatar({ userId, avatarFile });
  //     // console.log('result ', updateUserData);
  //     res.status(200).json({ data: updateUserData, message: 'updated' });
  //   } catch (error) {
  //     // console.log('upload error ', error);
  //     next(error);
  //   }
  // };

  // public deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  //   const userId = Number(req.params.id);

  //   try {
  //     const deleteUserData: User = await this.userService.deleteUserData(userId);
  //     res.status(200).json({ data: deleteUserData, message: 'deleted' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
  //   const userId = Number(req.params.id);

  //   try {
  //     const deleteUserData: User = await this.userService.deleteUserData(userId);
  //     res.status(200).json({ data: deleteUserData, message: 'deleted' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default PlansController;
