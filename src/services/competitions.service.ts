import HttpException from '../exceptions/HttpException';
import { Competition, CompetitionEntry, User } from '../interfaces/domain.interface';
import DB from '../../database';
import { isEmpty } from '../utils/util';
import { InvalidData } from '../exceptions';
import { Op } from 'sequelize';
import config from '../config';
import paystack from 'paystack';
import { CompetitionEntryDto, CreateCompetitionDto } from '../dtos/competitions.dto';

const env = process.env.NODE_ENV || 'development';
// const isProd = env !== 'development';

// mock imports
// import paystackMock from '../mocks/paystack';

class CompetitionService {
  public users = DB.Users;
  public address = DB.Address;
  public competitons = DB.Competitions;
  public tickets = DB.Tickets;
  public plans = DB.Plan;
  public competitionPlans = DB.CompetitionPlans;
  public subscriptions = DB.Subscriptions;
  public competitionEntries = DB.CompetitionEntries;

  public paystack = paystack(config[env].PAYSTACK_SECRET_KEY);

  public async findAllCompetitions(): Promise<Competition[]> {
    const allCompetitions: Competition[] = await this.competitons.findAll({ raw: true });

    const competitionList: any = allCompetitions.map(async e => {
      const data: Competition = {
        ...e,
      };

      const allowed_plans = await this.competitionPlans.findAll({
        where: { competitionId: e.id },
        include: [{ model: DB.sequelize.models.Plan, as: 'plan', required: true, attributes: ['plan_name', 'description', 'price'] }],
        attributes: { exclude: ['competitionId', 'id', 'planId', 'createdAt', 'updatedAt'] },
      });

      data.allowed_plans = allowed_plans.map((compPlans: any) => compPlans.plan);

      return data;
    });

    return Promise.all(competitionList);
  }

  public async findcompetitionById(competitionId: string): Promise<any> {
    if (isEmpty(competitionId)) throw new InvalidData();

    const findCompetition: Competition = await this.competitons.findByPk(competitionId, { raw: true });

    if (!findCompetition) throw new HttpException(409, 'Event not found');

    const allowed_plans = await this.competitionPlans.findAll({
      where: { competitionId: findCompetition.id },
      include: [{ model: DB.sequelize.models.Plan, as: 'plan', required: true, attributes: ['plan_name', 'description', 'price'] }],
      attributes: { exclude: ['competitionId', 'id', 'planId', 'createdAt', 'updatedAt'] },
    });

    const data: Competition = { ...findCompetition };

    data.allowed_plans = allowed_plans.map((compPlans: any) => compPlans.plan);

    return data;
  }

  public async createCompetition(data: CreateCompetitionDto): Promise<Competition> {
    if (isEmpty(data)) throw new InvalidData();

    const createCompetition: Competition = await this.competitons.create(data);
    if (!data.membership_types || data.membership_types.length === 0) return createCompetition;

    for (const planId of data.membership_types) {
      const checkPlan = await this.plans.findOne({ where: { id: planId } });

      if (!checkPlan) throw new HttpException(409, `Membership plan ${planId} doesn't exits`);

      const requiredPlan = await this.competitionPlans.findOne({ where: { competitionId: createCompetition.id, planId } });
      if (requiredPlan) continue;

      await this.competitionPlans.create({ competitionId: createCompetition.id, planId });
    }

    return createCompetition;
  }

  public async updateCompetition(competitionId: string, data: CreateCompetitionDto): Promise<Competition> {
    if (isEmpty(data)) throw new InvalidData();

    const findCompetition: Competition = await this.competitons.findByPk(competitionId);
    if (!findCompetition) throw new HttpException(409, 'Competition not registered');

    await this.competitons.update(data, { where: { id: competitionId } });

    const result: Competition = await this.competitons.findByPk(competitionId);
    return result;
  }

  public async deleteCompetitionData(competitionId: string): Promise<Competition> {
    if (isEmpty(competitionId)) throw new HttpException(400, 'Competition Id cannot be empty');

    await this.competitionPlans.destroy({ where: { competitionId } });

    const findCompetition: Competition = await this.competitons.findByPk(competitionId);
    if (!findCompetition) throw new HttpException(409, 'Competition not registered');

    await this.competitons.destroy({ where: { id: competitionId } });

    return findCompetition;
  }

  public async register(userId: string, entryData: CompetitionEntryDto): Promise<any> {
    // check if user has an active entry and abort
    const currentEntry = await this.competitionEntries.findOne({
      where: { userId: userId, competitionId: entryData.competitionId },
    });

    // if there's a active entry/registration return it
    if (currentEntry) {
      throw new HttpException(200, 'You already have an active registration');
    }

    const user: User = await this.users.findByPk(userId);

    const userPlan = await this.subscriptions.findOne({
      include: { model: DB.sequelize.models.Users, as: 'user', where: { id: user.id }, required: true },
    });

    const competition: Competition = await this.competitons.findByPk(entryData.competitionId);

    // get all restrictions for this event
    const allowedPlans = await this.competitionPlans.findAll({
      where: {
        competitionId: competition.id,
      },
      include: [{ model: DB.sequelize.models.Plan, as: 'plan' }],
    });

    console.log('required plans ', allowedPlans);

    if (allowedPlans.length === 0) {
      // event is opened to all plan types
      const newEntry = await this.competitionEntries.create(
        {
          userId: user.id,
          competitionId: competition.id,
        },
        {
          include: [
            { model: DB.sequelize.models.Users, as: 'user', required: true },
            { model: DB.sequelize.models.Competitions, as: 'competition', required: true },
          ],
        },
      );

      return newEntry;
    }

    // check the event_plan table to see if user qualifies to register for this current event
    const competitionPlan = await this.competitionPlans.findOne({
      where: {
        [Op.and]: {
          competitionId: competition.id,
          planId: userPlan.planId,
        },
      },
    });

    if (!competitionPlan) {
      throw new HttpException(200, 'You are not eligibile to register for this competition');
    }

    const newEntry = await this.competitionEntries.create(
      {
        userId: user.id,
        competitionId: competition.id,
      },
      {
        include: [
          { model: DB.sequelize.models.Users, as: 'user', required: true },
          { model: DB.sequelize.models.Competitions, as: 'competition', required: true },
        ],
      },
    );

    return newEntry;
  }

  public async getUserEntry(userId: string, competitionId: string): Promise<CompetitionEntry> {
    // get a user's registration details for an competition
    const entry: CompetitionEntry = await this.competitionEntries.findOne({
      where: { competitionId, userId },
      attributes: { exclude: ['userId', 'competitionId'] },
      include: [{ all: true, attributes: { exclude: ['password'] } }],
    });

    return entry;
  }

  public async getCompetitionEntries(competitionId): Promise<CompetitionEntry[]> {
    // get a list of registrations for an competition
    const entries: CompetitionEntry[] = await this.competitionEntries.findAll({
      where: { competitionId },
      include: [
        { model: DB.sequelize.models.Users, as: 'user', required: true, attributes: { exclude: ['password'] } },
        { model: DB.sequelize.models.Competitions, as: 'competition', required: true },
      ],
      attributes: {
        exclude: ['competitionId', 'userId'],
      },
    });

    return entries;
  }
  /*
    public async getAllUserEventRegistrations(userId: string): Promise<Ticket[]> {
      // get a list of events a user has ever registered for
      const userTicket: Ticket[] = await this.tickets.findAll({
        where: { userId },
        include: [{ all: true, attributes: { exclude: ['password', 'userId', 'eventId'] } }],
      });
  
      return userTicket;
    }
  
    
    */
}

export default CompetitionService;
