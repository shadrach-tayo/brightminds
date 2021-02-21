import HttpException from '../exceptions/HttpException';
import { Plan, Subscription, User } from '../interfaces/domain.interface';
import DB from '../../database';
import { isEmpty } from '../utils/util';
import { CreatePlanDto } from '../dtos/subscriptions.dto';
import { SubscriptionStatus } from '../interfaces/domain.enum';
import paystack from 'paystack';
import config from '../config';
const env = process.env.NODE_ENV || 'development';

class PlanService {
  public users = DB.Users;
  public plans = DB.Plans;
  public subcriptions = DB.Subscriptions;
  private paystack = paystack(config[env].PAYSTACK_SECRET_KEY);

  public async findAllPlans(): Promise<Plan[]> {
    const allUser: Plan[] = await this.plans.findAll();
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
    const currentSub: Subscription = await this.subcriptions.findByPk(userId, {
      include: [DB.sequelize.models.Plan],
    });

    return currentSub;
  }

  public async getSubscriptions(): Promise<Subscription[]> {
    // check if user has an active subscription and abort
    const currentSub: Subscription[] = await this.subcriptions.findAll({ include: [DB.sequelize.models.Users, DB.sequelize.models.Plans] });

    return currentSub;
  }

  public async subscribe(userId: string, subscriptionData: Subscription): Promise<Subscription> {
    console.log('subscribe', userId, subscriptionData);
    // check if user has an active subscription and abort
    const currentSub: Subscription = await this.subcriptions.findOne({ where: { userId: userId } });

    // if there's a active subscription return it
    if (currentSub && currentSub.status === SubscriptionStatus.SUCCESS /*|| currentSub.status === SubscriptionStatus.PENDING */) {
      return currentSub;
    }

    const currentUser: User = await this.users.findByPk(userId);
    const currentPlan: Plan = await this.plans.findByPk(subscriptionData.planId);

    // verify payment
    const res = await this.paystack.transaction.verify(subscriptionData.transaction_ref);

    if (res.status === false) {
      throw new HttpException(401, res.message);
    }

    if (res.data.status === 'success') {
      // create new subscription or update current inactive sub to unpaid subscripton for user

      const newSub = await this.subcriptions.create({
        ...subscriptionData,
        userId: currentUser.id,
        planId: currentPlan.id,
        valid_from: currentPlan.valid_from,
        valid_to: currentPlan.valid_to,
      });

      // create  invoice for current subscription

      return newSub;
    } else {
      throw new HttpException(400, 'Transaction not successful');
    }
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

  public async deleteUserData(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.users.destroy({ where: { id: userId } });

    return findUser;
  }
}

export default PlanService;
