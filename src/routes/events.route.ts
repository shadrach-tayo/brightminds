import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import multer, { FileFilterCallback } from 'multer';
import authMiddleware from '../common/middlewares/auth.middleware';
import HttpException from '../exceptions/HttpException';
import permissionMiddleWare from '../common/middlewares/permission.middleware';
import { RESOURCES } from '../common/enum';
import validationMiddleware from '../common/middlewares/validation.middleware';
import EventsController from '../controllers/events.controller';
import { CreateEventDto, CreateTicketDto } from '../dtos/resources.dto';
class EventsRoute implements Route {
  public path = '/events';
  public router = Router();
  public FILE_SIZE_LIMIT = 1 * 1024 * 1024;
  public eventsController = new EventsController();
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
    this.router.post(
      `${this.path}/upload-image/:id`,
      authMiddleware,
      permissionMiddleWare.grantAccess('updateAny', RESOURCES.EVENTS),
      this.upload.single('banner'),
      this.eventsController.uploadEventBannner,
    );

    this.router.post(
      `${this.path}`,
      // this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('createAny', RESOURCES.EVENTS),
      validationMiddleware(CreateEventDto, 'body', true),
      this.eventsController.createEvent,
    );

    this.router.post(
      `${this.path}/register`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('createOwn', RESOURCES.EVENTS),
      validationMiddleware(CreateTicketDto, 'body'),
      this.eventsController.registerEvent,
    );

    this.router.get(
      `${this.path}/:eventId/registration/:userId`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('readOwn', RESOURCES.EVENTS),
      this.eventsController.getUserEventRegistration,
    );

    this.router.get(
      `${this.path}/registrations/:userId`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('readOwn', RESOURCES.EVENTS),
      this.eventsController.getAllUserEventRegistrations,
    );

    this.router.get(
      `${this.path}/:eventId/registrations`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('readAny', RESOURCES.EVENTS),
      this.eventsController.getEventRegistrations,
    );

    this.router.get(`${this.path}`, authMiddleware, permissionMiddleWare.grantAccess('readOwn', RESOURCES.EVENTS), this.eventsController.getEvents);

    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      permissionMiddleWare.grantAccess('readAny', RESOURCES.EVENTS),
      this.eventsController.getEventById,
    );

    this.router.put(
      `${this.path}/:id`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('updateAny', RESOURCES.EVENTS),
      validationMiddleware(CreateEventDto, 'body', true),
      this.eventsController.updateEvent,
    );

    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      permissionMiddleWare.grantAccess('deleteAny', RESOURCES.EVENTS),
      this.eventsController.deleteEvent,
    );
  }
}

export default EventsRoute;
