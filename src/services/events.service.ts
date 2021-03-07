import HttpException from '../exceptions/HttpException';
import { Address, Event, Ticket, User } from '../interfaces/domain.interface';
import DB from '../../database';
import { isEmpty } from '../utils/util';
import { InvalidData } from '../exceptions';
import { Op } from 'sequelize';
import { CreateEventDto } from '../dtos/resources.dto';
import config from '../config';
import paystack from 'paystack';

const env = process.env.NODE_ENV || 'development';
const isProd = env !== 'development';

// mock imports
import paystackMock from '../mocks/paystack';

class EventService {
  public users = DB.Users;
  public address = DB.Address;
  public events = DB.Events;
  public tickets = DB.Tickets;
  public paystack = paystack(config[env].PAYSTACK_SECRET_KEY);

  public async findAllEvents(params: any = {}): Promise<Event[]> {
    const allEvents: Event[] = await this.events.findAll({ attributes: { exclude: ['addressId'] }, include: [{ all: true }] });
    return allEvents;
  }

  public async findEventById(eventId: string): Promise<any> {
    if (isEmpty(eventId)) throw new InvalidData();

    const findEvent: Event = await this.events.findByPk(eventId);

    if (!findEvent) throw new HttpException(409, 'Event not found');

    return findEvent;
  }

  public async createEvent(data: CreateEventDto): Promise<Event> {
    if (isEmpty(data)) throw new HttpException(400, "You're not data");

    if (!data.address) throw new HttpException(400, 'Invalid Address data');
    const eventAddress: Address = await this.address.create(data.address);

    const createEvent: Event = await this.events.create({ ...data, addressId: eventAddress.id }, { include: DB.sequelize.models.Address });

    return createEvent;
  }

  public async updateEvent(eventId: string, eventData: CreateEventDto): Promise<Event> {
    if (isEmpty(eventData)) throw new InvalidData();

    const findEvent: Event = await this.events.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, 'Event not registered');

    await this.events.update({ ...eventData }, { where: { id: eventId } });

    if (!isEmpty(eventData.address)) {
      await this.address.update({ ...eventData.address }, { where: { id: findEvent.addressId } });
    }

    const data: Event = await this.events.findByPk(eventId, { include: [{ all: true }] });
    return data;
  }

  public async deleteEventData(eventId: string): Promise<Event> {
    if (isEmpty(eventId)) throw new HttpException(400, 'Event Id cannot be empty');

    const findEvent: Event = await this.events.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, 'Event not registered');

    await this.events.destroy({ where: { id: eventId } });

    return findEvent;
  }

  public async register(userId: string, ticketData: Ticket): Promise<Ticket> {
    /**
     * TODO: CATER FOR FREE EVENTS
     */

    // check if user has an active Ticket and abort
    const currentSub: Ticket = await this.tickets.findOne({
      where: { [Op.or]: [{ userId: userId, eventId: ticketData.eventId }, { transaction_ref: ticketData.transaction_ref }] },
    });

    // if there's a active subscription return it
    if (currentSub) {
      throw new HttpException(200, 'You already have an active registration');
    }

    const currentUser: User = await this.users.findByPk(userId);
    const currentEvent: Event = await this.events.findByPk(ticketData.eventId);

    if (currentEvent.entry_fee == '0') {
      // if entry_fee is 0 skip to creating ticketƒ
      // free events --> create ticket and return;
      const newSub = await this.tickets.create({
        ...ticketData,
        userId: currentUser.id,
        eventId: currentEvent.id,
      });

      return newSub;
    }

    // verify payment
    let res;
    if (isProd) {
      res = await this.paystack.transaction.verify(ticketData.transaction_ref);
    } else {
      res = await paystackMock.transaction.verify(ticketData.transaction_ref); // testing purposes
    }

    if (res.status === false) {
      throw new HttpException(401, res.message);
    }

    if (res.data.status === 'success') {
      // create new ticket or update

      const newSub = await this.tickets.create(
        {
          ...ticketData,
          userId: currentUser.id,
          eventId: currentEvent.id,
        },
        { include: { all: true, attributes: { exclude: ['eventId', 'userId'] } } },
      );

      // create  invoice for current ticket

      return newSub;
    } else {
      throw new HttpException(400, 'Transaction not successful');
    }
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
