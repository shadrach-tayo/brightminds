import HttpException from '../exceptions/HttpException';
import { Plan, Subscription, User } from '../interfaces/domain.interface';
import DB from '../../database';
import { compareDateFn, isEmpty } from '../utils/util';
import { Op } from 'sequelize';

import { CreatePlanDto } from '../dtos/subscriptions.dto';
import { SubscriptionStatus } from '../interfaces/domain.enum';
import paystack from 'paystack';
import config from '../config';
const env = process.env.NODE_ENV || 'development';
const isProd = env !== 'development';

// mock imports
import paystackMock from '../mocks/paystack';
class PlanService {
  public users = DB.Users;
  public plans = DB.Plan;
  public subcriptions = DB.Subscriptions;
  private paystack = paystack(config[env].PAYSTACK_SECRET_KEY);

  public async findAllPlans(): Promise<Plan[]> {
    const allUser: Plan[] = await this.plans.findAll();
    return allUser;
  }

  public async getSubscribedUsers(planId: string): Promise<Subscription[]> {
    const exists = await this.plans.findByPk(planId);
    if (!exists) throw new HttpException(409, 'Plan does not exists');

    const allUser: Subscription[] = await this.subcriptions.findAll({
      where: { planId },
      include: [{ model: DB.sequelize.models.Users, as: 'user' }],
    });
    return allUser;
  }

  public async findActivePlans(): Promise<Plan[]> {
    const allUser: Plan[] = await this.plans.findAll({ where: { is_active: true } });
    return allUser;
  }

  public async findPlanById(id: string): Promise<Plan> {
    const planData: Plan = await this.plans.findByPk(id);
    if (!planData) throw new HttpException(409, "You're not user");

    return planData;
  }

  public async createPlan(planData: CreatePlanDto): Promise<Plan> {
    if (isEmpty(planData)) throw new HttpException(400, "You're not planData");

    const plan: Plan = await this.plans.create({ ...planData });

    return plan;
  }

  public async getSubscription(userId: string): Promise<Subscription> {
    // check if user has an active subscription and abort
    const currentSub: Subscription = await this.subcriptions.findOne({
      where: { userId },
      include: [{ all: true, attributes: { exclude: ['password'] } }],
    });

    return currentSub;
  }

  public async getSubscriptions(): Promise<Subscription[]> {
    // check if user has an active subscription and abort
    const currentSub: Subscription[] = await this.subcriptions.findAll({
      include: [
        { model: DB.sequelize.models.Users, as: 'user', attributes: { exclude: ['password'] } },
        { model: DB.sequelize.models.Plan, as: 'plan' },
      ],
    });

    return currentSub;
  }

  public async subscribe(userId: string, subscriptionData: Subscription): Promise<Subscription> {
    // check if user has an active subscription and abort
    const currentSub: Subscription = await this.subcriptions.findOne({
      where: { [Op.or]: [{ userId: userId }, { transaction_ref: subscriptionData.transaction_ref }] },
    });

    // if there's a active subscription return it
    if (currentSub && compareDateFn(currentSub.valid_to, new Date().toISOString())) {
      throw new HttpException(200, 'You alread have an active subscription');
      // return currentSub;
    }

    const currentUser: User = await this.users.findByPk(userId);
    const currentPlan: Plan = await this.plans.findByPk(subscriptionData.planId);

    // verify payment
    let res;
    if (isProd) {
      res = await this.paystack.transaction.verify(subscriptionData.transaction_ref);
    } else {
      res = await paystackMock.transaction.verify(subscriptionData.transaction_ref); // testing purposes
    }

    if (res.status === false) {
      throw new HttpException(401, res.message);
    }

    if (res.data.status === 'success') {
      // create new subscription or update current inactive sub to unpaid subscripton for user

      const newSub = await this.subcriptions.create({
        ...subscriptionData,
        status: SubscriptionStatus.SUCCESS,
        userId: currentUser.id,
        planId: currentPlan.id,
        date_subscribed: new Date().toISOString(),
        valid_from: currentPlan.valid_from,
        valid_to: currentPlan.valid_to,
      });

      // create  invoice for current subscription

      return newSub;
    } else {
      throw new HttpException(400, 'Transaction not successful');
    }
  }

  public async subscribeUser(userId: string, subscriptionData: Subscription): Promise<Subscription> {
    // check if user has an active subscription and abort
    const currentSub: Subscription = await this.subcriptions.findOne({
      where: { [Op.or]: [{ userId: userId }, { transaction_ref: subscriptionData.transaction_ref }] },
    });

    // if there's a active subscription return it
    if (currentSub && compareDateFn(currentSub.valid_to, new Date().toISOString())) {
      throw new HttpException(200, 'You already have an active subscription');
      // return currentSub;
    }

    const currentUser: User = await this.users.findByPk(userId);
    const currentPlan: Plan = await this.plans.findByPk(subscriptionData.planId);

    let res, newSub;

    if (subscriptionData.transaction_ref) {
      // verify payment
      if (isProd) {
        res = await this.paystack.transaction.verify(subscriptionData.transaction_ref);
      } else {
        res = await paystackMock.transaction.verify(subscriptionData.transaction_ref); // testing purposes
      }

      if (res.status === false) {
        throw new HttpException(401, res.message);
      }

      if (res.data.status === 'success') {
        newSub = await this.subcriptions.upsert({
          ...subscriptionData,
          status: SubscriptionStatus.SUCCESS,
          userId: currentUser.id,
          planId: currentPlan.id,
          date_subscribed: new Date().toISOString(),
          valid_from: currentPlan.valid_from,
          valid_to: currentPlan.valid_to,
        });
        return newSub;
      } else {
        throw new HttpException(400, 'Transaction not successful');
      }
    }
    //  create new subscription or update current inactive sub to unpaid subscripton for user

    newSub = await this.subcriptions.upsert({
      ...subscriptionData,
      status: SubscriptionStatus.SUCCESS,
      userId: currentUser.id,
      planId: currentPlan.id,
      date_subscribed: new Date().toISOString(),
      valid_from: currentPlan.valid_from,
      valid_to: currentPlan.valid_to,
    });

    return newSub;
    // create  invoice for current subscription
  }

  public async updateUserSubscription(userId: string, subscriptionData: Subscription): Promise<Subscription> {
    // check if user has an active subscription and abort
    const currentSub: Subscription = await this.subcriptions.findOne({
      where: { userId: userId },
    });

    if (!currentSub) {
      throw new HttpException(401, 'User has no subscription');
    }

    const currentUser: User = await this.users.findByPk(userId);
    const currentPlan: Plan = await this.plans.findByPk(currentSub.planId);
    if (!currentUser || !currentPlan) {
      throw new HttpException(401, 'User or Plan not found');
    }

    let res, result;

    if (subscriptionData.transaction_ref) {
      // verify payment
      if (isProd) {
        res = await this.paystack.transaction.verify(subscriptionData.transaction_ref);
      } else {
        res = await paystackMock.transaction.verify(subscriptionData.transaction_ref); // testing purposes
      }

      if (res.status === false) {
        throw new HttpException(401, res.message);
      }

      if (res.data.status === 'success') {
        result = await this.subcriptions.update(
          {
            ...currentSub,
            status: SubscriptionStatus.SUCCESS,
            ...subscriptionData,
          },
          { where: { userId } },
        );
        return result[1];
      } else {
        throw new HttpException(400, 'Transaction not successful');
      }
    }

    // update current inactive sub to unpaid subscripton for user
    result = await this.subcriptions.update(
      {
        ...currentSub,
        ...subscriptionData,
      },
      { where: { userId } },
    );

    return result[1];
    // create  invoice for current subscription
  }

  public async verifySubscription(ref: string): Promise<any> {
    // verify paystack payemtn
    return this.paystack.transaction.verify(ref);
  }

  public async updatePlan(Id: string, planData: Plan): Promise<Plan> {
    if (isEmpty(planData)) throw new HttpException(400, "You're not userData");

    const findPlan: Plan = await this.plans.findByPk(Id);
    if (!findPlan) throw new HttpException(409, "You're not user");

    await this.plans.update({ ...planData }, { where: { id: Id } });
    const updatedPlan = await this.plans.findByPk(Id);
    return updatedPlan; // result[0] ? true : false;
  }

  // public async deleteUserData(userId: number): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

  //   const findUser: User = await this.users.findByPk(userId);
  //   if (!findUser) throw new HttpException(409, "You're not user");

  //   await this.users.destroy({ where: { id: userId } });

  //   return findUser;
  // }
}

export default PlanService;
