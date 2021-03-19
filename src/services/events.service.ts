import HttpException from '../exceptions/HttpException';
import { Event, Ticket, User } from '../interfaces/domain.interface';
import DB from '../../database';
import { isEmpty } from '../utils/util';
import { InvalidData } from '../exceptions';
import { Op } from 'sequelize';
import { CreateEventDto, CreateTicketDto } from '../dtos/resources.dto';
import config from '../config';
import paystack from 'paystack';

const env = process.env.NODE_ENV || 'development';
// const isProd = env !== 'development';

// mock imports
// import paystackMock from '../mocks/paystack';

class EventService {
  public users = DB.Users;
  public address = DB.Address;
  public events = DB.Events;
  public tickets = DB.Tickets;
  public plans = DB.Plan;
  public eventsPlan = DB.EventsPlan;
  public subscriptions = DB.Subscriptions;

  public paystack = paystack(config[env].PAYSTACK_SECRET_KEY);

  public async findAllEvents(): Promise<Event[]> {
    const allEvents: Event[] = await this.events.findAll();

    const eventList: any = allEvents.map(async e => {
      const data: Event = {
        id: e.id,
        title: e.title,
        description: e.description,
        banner: e.banner,
        start_date: e.start_date,
        end_date: e.end_date,
        // event_time: e.event_time,
        location: e.location,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };

      const allowed_plans = await this.eventsPlan.findAll({
        where: { eventId: e.id },
        include: [{ model: DB.sequelize.models.Plan, as: 'plan' }],
        attributes: { exclude: ['eventId'] },
      });
      data.allowed_plans = allowed_plans;

      return data;
    });

    return Promise.all(eventList);
  }

  public async findEventById(eventId: string): Promise<any> {
    if (isEmpty(eventId)) throw new InvalidData();

    const findEvent: Event = await this.events.findByPk(eventId, { raw: true });

    if (!findEvent) throw new HttpException(409, 'Event not found');

    const data: Event = {
      id: findEvent.id,
      title: findEvent.title,
      description: findEvent.description,
      banner: findEvent.banner,
      start_date: findEvent.start_date,
      end_date: findEvent.end_date,
      // event_time: findEvent.event_time,
      location: findEvent.location,
      createdAt: findEvent.createdAt,
      updatedAt: findEvent.updatedAt,
    };

    const requiredPlans = await this.eventsPlan.findAll({
      where: { eventId: findEvent.id },
      include: [{ model: DB.sequelize.models.Plan, as: 'plan' }],
      attributes: { exclude: ['eventId'] },
    });

    data.allowed_plans = requiredPlans;

    return data;
  }

  public async createEvent(data: CreateEventDto): Promise<Event> {
    if (isEmpty(data)) throw new InvalidData();

    const createEvent: Event = await this.events.create({ ...data });
    // if (!data.membership_types || data.membership_types.length === 0) throw new HttpException(409, 'Membership types cannot be empty');
    if (!data.membership_types || data.membership_types.length === 0) return createEvent;

    for (const planId of data.membership_types) {
      const checkPlan = await this.plans.findOne({ where: { id: planId } });

      if (!checkPlan) throw new HttpException(409, `Membership plan ${planId} doesn't exits`);

      const event_plan = await this.eventsPlan.findOne({ where: { eventId: createEvent.id, planId } });
      if (event_plan) continue;

      await this.eventsPlan.create({ eventId: createEvent.id, planId });
    }

    return createEvent;
  }

  public async updateEvent(eventId: string, eventData: CreateEventDto): Promise<Event> {
    if (isEmpty(eventData)) throw new InvalidData();

    const findEvent: Event = await this.events.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, 'Event not registered');

    await this.events.update({ ...eventData }, { where: { id: eventId } });

    const data: Event = await this.events.findByPk(eventId, { include: [{ all: true }] });
    return data;
  }

  public async deleteEventData(eventId: string): Promise<Event> {
    if (isEmpty(eventId)) throw new HttpException(400, 'Event Id cannot be empty');

    await this.eventsPlan.destroy({ where: { eventId } });

    const findEvent: Event = await this.events.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, 'Event not registered');

    await this.events.destroy({ where: { id: eventId } });

    return findEvent;
  }

  public async register(userId: string, ticketData: CreateTicketDto): Promise<Ticket> {
    // check if user has an active Ticket and abort
    const currentTicket: Ticket = await this.tickets.findOne({
      where: { [Op.or]: [{ userId: userId, eventId: ticketData.eventId }] },
    });

    // if there's a active subscription return it
    if (currentTicket) {
      throw new HttpException(200, 'You already have an active registration');
    }

    const currentUser: User = await this.users.findByPk(userId);

    const userPlan = await this.subscriptions.findOne({
      include: { model: DB.sequelize.models.Users, as: 'user', where: { id: currentUser.id }, required: true },
    });

    const currentEvent: Event = await this.events.findByPk(ticketData.eventId);

    // get all restrictions for this event
    const eventRestrictions = await this.eventsPlan.findAll({
      where: {
        eventId: currentEvent.id,
      },
      include: [
        { model: DB.sequelize.models.Plan, as: 'plan' },
        { model: DB.sequelize.models.Events, as: 'event' },
      ],
    });
    console.log('required plans ', eventRestrictions);
    if (eventRestrictions.length === 0) {
      // event is opened to all plan types
      const newSub = await this.tickets.create(
        {
          userId: currentUser.id,
          eventId: currentEvent.id,
        },
        {
          include: [
            { model: DB.sequelize.models.Users, as: 'user' },
            { model: DB.sequelize.models.Events, as: 'event' },
          ],
        },
      );

      return newSub;
    }

    // check the event_plan table to see if user qualifies to register for this current event
    const findEventPlan = await this.eventsPlan.findOne({
      where: {
        [Op.and]: {
          eventId: currentEvent.id,
          planId: userPlan.planId,
        },
      },
      include: [
        { model: DB.sequelize.models.Plan, as: 'plan', where: { id: userPlan.planId }, required: true },
        { model: DB.sequelize.models.Events, as: 'event', where: { id: currentEvent.id }, required: true },
      ],
    });

    if (!findEventPlan) {
      throw new HttpException(200, 'You are not eligibile to register for this event');
    }

    const newSub = await this.tickets.create(
      {
        userId: currentUser.id,
        eventId: currentEvent.id,
      },
      {
        include: [
          { model: DB.sequelize.models.Users, as: 'user' },
          { model: DB.sequelize.models.Events, as: 'event' },
        ],
      },
    );

    return newSub;
  }

  public async getUserRegistration(userId: string, eventId: string): Promise<Ticket> {
    // get a user's registration details for an event
    const currentSub: Ticket = await this.tickets.findOne({
      where: { eventId, userId },
      include: [{ all: true, attributes: { exclude: ['password', 'userId', 'eventId'] } }],
    });

    return currentSub;
  }

  public async getAllUserEventRegistrations(userId: string): Promise<Ticket[]> {
    // get a list of events a user has ever registered for
    const userTicket: Ticket[] = await this.tickets.findAll({
      where: { userId },
      include: [{ all: true, attributes: { exclude: ['password', 'userId', 'eventId'] } }],
    });

    return userTicket;
  }

  public async getEventRegistrations(eventId): Promise<Ticket[]> {
    // get a list of registrations for an event
    const userTickets: Ticket[] = await this.tickets.findAll({
      where: { eventId },
      include: [
        { model: DB.sequelize.models.Users, as: 'user', required: true, attributes: { exclude: ['password'] } },
        { model: DB.sequelize.models.Events, as: 'event', required: true },
      ],
      attributes: {
        exclude: ['eventId', 'userId'],
      },
    });

    return userTickets;
  }
}

export default EventService;
