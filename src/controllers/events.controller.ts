import { NextFunction, Request, Response } from 'express';
import { CreateEventDto, CreateTicketDto } from '../dtos/resources.dto';
import HttpException from '../exceptions/HttpException';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { Event, Ticket } from '../interfaces/domain.interface';
import EventService from '../services/events.service';
import UploadService from '../services/upload.service';
import UserService from '../services/users.service';

class EventsController {
  public userService = new UserService();
  public uploadService = new UploadService();
  public eventService = new EventService();

  public getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: Event[] = await this.eventService.findAllEvents();
      res.status(200).json({ data: findAllUsersData, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public getEventById = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;

    try {
      const findOneEventData: Event = await this.eventService.findEventById(eventId);
      res.status(200).json({ data: findOneEventData, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const data: CreateEventDto = req.body;
    // const avatarFile = req.file;
    // console.log('data ', data);
    try {
      const createEventData: Event = await this.eventService.createEvent(data);
      // const avatarUpload = await this.uploadService.uploadEventBanner({ eventId: createEventData.id, avatarFile });
      res.status(201).json({ data: { ...createEventData }, message: 'created' });
    } catch (error) {
      console.log('err ', error);
      next(error);
    }
  };

  public updateEvent = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const eventId = req.params.id;
    const eventData: CreateEventDto = req.body;

    try {
      const data: Event = await this.eventService.updateEvent(eventId, eventData);
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public uploadEventBannner = async (req: RequestWithFile, res: Response, next: NextFunction) => {
    const eventId = req.params.id;
    const avatarFile = req.file;
    if (!avatarFile) {
      return next(new HttpException(409, 'File not accepted, check file size and extension'));
    }
    try {
      const data = await this.uploadService.uploadEventBanner({ eventId, avatarFile });
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      // console.log('upload error ', error);
      next(error);
    }
  };

  public deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;

    try {
      const deleteUserData: Event = await this.eventService.deleteEventData(eventId);
      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public registerEvent = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateTicketDto = req.body;
    const userId: string = req.params.userId || req.user.id;

    try {
      const result: Ticket = await this.eventService.register(userId, data);
      res.status(201).json({ result, message: 'created' });
    } catch (error) {
      console.log('err ', error);
      next(error);
    }
  };

  public getUserEventRegistration = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    const userId = req.params.userId || req.user.id;

    try {
      const data: Ticket = await this.eventService.getUserRegistration(userId, eventId);
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public getAllUserEventRegistrations = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = req.params.userId || req.user.id;
    try {
      const data: Ticket[] = await this.eventService.getAllUserEventRegistrations(userId);
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public getEventRegistrations = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    try {
      const data: Ticket[] = await this.eventService.getEventRegistrations(eventId);
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };
}

export default EventsController;
