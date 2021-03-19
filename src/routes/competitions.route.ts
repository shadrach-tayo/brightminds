import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import multer, { FileFilterCallback } from 'multer';
import authMiddleware from '../common/middlewares/auth.middleware';
import HttpException from '../exceptions/HttpException';
import permissionMiddleWare from '../common/middlewares/permission.middleware';
import { RESOURCES } from '../common/enum';
import validationMiddleware from '../common/middlewares/validation.middleware';
import CompetitonController from '../controllers/competitions.controller';
import { CompetitionEntryDto, CreateCompetitionDto } from '../dtos/competitions.dto';

class CompetitionsRoute implements Route {
  public path = '/competitions';
  public router = Router();
  public FILE_SIZE_LIMIT = 1 * 1024 * 1024;
  public competitonsController = new CompetitonController();
  public upload = multer({
    dest: 'upload/competitions/',
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
      `${this.path}/upload-image/:competitionId`,
      authMiddleware,
      permissionMiddleWare.grantAccess('updateAny', RESOURCES.COMPETITION),
      this.upload.single('banner'),
      this.competitonsController.uploadCompetitionBannner,
    );

    this.router.post(
      `${this.path}`,
      // this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('createAny', RESOURCES.COMPETITION),
      validationMiddleware(CreateCompetitionDto, 'body'),
      this.competitonsController.createCompetition,
    );

    this.router.post(
      `${this.path}/register`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.isSameUserOrAdmin('createAny', RESOURCES.COMPETITION),
      validationMiddleware(CompetitionEntryDto, 'body'),
      this.competitonsController.registerCompetition,
    );

    this.router.get(
      `${this.path}/:competitionId/registration/:userId`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('readOwn', RESOURCES.COMPETITION),
      this.competitonsController.getUserEntry,
    );

    this.router.get(
      `${this.path}/registrations/:userId`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('readOwn', RESOURCES.COMPETITION),
      // this.competitonsController.getAllUserEventRegistrations,
    );

    this.router.get(
      `${this.path}/:competitionId/registrations`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('readAny', RESOURCES.COMPETITION),
      this.competitonsController.getCompetitionEntries,
    );

    this.router.get(
      `${this.path}`,
      authMiddleware,
      permissionMiddleWare.grantAccess('readOwn', RESOURCES.COMPETITION),
      this.competitonsController.getCompetitions,
    );

    this.router.get(
      `${this.path}/:competitionId`,
      authMiddleware,
      permissionMiddleWare.grantAccess('readOwn', RESOURCES.COMPETITION),
      this.competitonsController.getCompetitionById,
    );

    this.router.put(
      `${this.path}/:competitionId`,
      this.upload.none(),
      authMiddleware,
      permissionMiddleWare.grantAccess('updateAny', RESOURCES.COMPETITION),
      validationMiddleware(CreateCompetitionDto, 'body', true),
      this.competitonsController.updateCompetition,
    );

    this.router.delete(
      `${this.path}/:competitionId`,
      authMiddleware,
      permissionMiddleWare.grantAccess('deleteAny', RESOURCES.COMPETITION),
      this.competitonsController.deleteCompetition,
    );
  }
}

export default CompetitionsRoute;
