import { NextFunction, Request, Response } from 'express';
import { CompetitionEntryDto, CreateCompetitionDto } from '../dtos/competitions.dto';
import HttpException from '../exceptions/HttpException';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { Competition, CompetitionEntry } from '../interfaces/domain.interface';
import CompetitionService from '../services/competitions.service';
import EventService from '../services/events.service';
import UploadService from '../services/upload.service';
import UserService from '../services/users.service';

class CompetitonController {
  public userService = new UserService();
  public uploadService = new UploadService();
  public eventService = new EventService();
  public competitionService = new CompetitionService();

  public getCompetitions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Competition[] = await this.competitionService.findAllCompetitions();
      res.status(200).json({ data: data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public getCompetitionById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.competitionId;

    try {
      const data: Competition = await this.competitionService.findcompetitionById(id);
      res.status(200).json({ data, message: 'Event data retrieved' });
    } catch (error) {
      next(error);
    }
  };

  public createCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const data: CreateCompetitionDto = req.body;
    try {
      const result: Competition = await this.competitionService.createCompetition(data);
      res.status(201).json({ data: result, message: 'created' });
    } catch (error) {
      console.log('err ', error);
      next(error);
    }
  };

  public updateCompetition = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const competitionId = req.params.competitionId;
    const body: CreateCompetitionDto = req.body;

    try {
      const data: Competition = await this.competitionService.updateCompetition(competitionId, body);
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public uploadCompetitionBannner = async (req: RequestWithFile, res: Response, next: NextFunction) => {
    const competitionId = req.params.competitionId;
    const avatarFile = req.file;
    if (!avatarFile) {
      return next(new HttpException(409, 'File not accepted, check file size and extension'));
    }
    try {
      const data = await this.uploadService.uploadCompetitionBanner({ competitionId, avatarFile });
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      // console.log('upload error ', error);
      next(error);
    }
  };

  public deleteCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const competitionId = req.params.competitionId;
    try {
      const data: Competition = await this.competitionService.deleteCompetitionData(competitionId);
      res.status(200).json({ data, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public registerCompetition = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CompetitionEntryDto = req.body;
    const userId: string = req.body.userId || req.user.id;

    try {
      const result: CompetitionEntry = await this.competitionService.register(userId, data);
      res.status(201).json({ result, message: 'created' });
    } catch (error) {
      console.log('err ', error);
      next(error);
    }
  };

  public getUserEntry = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const competitionId = req.params.competitionId;
    const userId = req.params.userId || req.user.id;

    try {
      const data: CompetitionEntry = await this.competitionService.getUserEntry(userId, competitionId);
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };

  // public getAllUserCompetitionRegistrations = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  //   const userId = req.params.userId || req.user.id;
  //   try {
  //     const data: Ticket[] = await this.competitionService.getAllUserCompetistionRegistrations(userId);
  //     res.status(200).json({ data, message: '' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public getCompetitionEntries = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const competitionId = req.params.competitionId;
    try {
      const data: CompetitionEntry[] = await this.competitionService.getCompetitionEntries(competitionId);
      res.status(200).json({ data, message: '' });
    } catch (error) {
      next(error);
    }
  };
}

export default CompetitonController;
