import HttpException from '../exceptions/HttpException';
import { User, Event, Competition } from '../interfaces/domain.interface';
import DB from '../../database';
import aws from 'aws-sdk';
import fs from 'fs';
import { logger } from '../utils/logger';
class UploadService {
  public users = DB.Users;
  public events = DB.Events;
  public competitions = DB.Competitions;
  public s3 = new aws.S3();
  private USER_AVATAR_KEY = 'userAvatar';
  private EVENT_BANNER_KEY = 'events';
  private COMPETITION_BANNER_KEY = 'competitions';

  public async uploadUserAvatar({ userId, avatarFile }): Promise<User> {
    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    const arr = avatarFile.originalname.split('.');
    const fileExt = arr[arr.length - 1];
    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(avatarFile.path),
      Key: `${this.USER_AVATAR_KEY}/${userId}.${fileExt}`,
    };

    const result = await this.s3
      .upload(params)
      .promise()
      .then(async data => {
        if (data) {
          fs.unlinkSync(process.cwd() + '/' + avatarFile.path); // Empty temp folder
          const locationUrl = data.Location;

          await this.users.update({ avatar_url: locationUrl }, { where: { id: userId } });
          const updatedUser: User = await this.users.findByPk(userId, { attributes: ['avatar_url'] });
          return updatedUser;
        } else {
          throw new HttpException(409, 'We could not upload you image avatar now, try again later');
        }
      })
      .catch(err => {
        logger.error(err.message, err.code);
        throw new HttpException(500, "You can't upload user avatar for now, we are working to fix it");
      });
    return result;
  }

  public async uploadEventBanner({ eventId, avatarFile }): Promise<Event> {
    const findEvent: Event = await this.events.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, 'Event is not registered');

    const arr = avatarFile.originalname.split('.');
    const fileExt = arr[arr.length - 1];
    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(avatarFile.path),
      Key: `${this.EVENT_BANNER_KEY}/${eventId}.${fileExt}`,
    };

    const result = await this.s3
      .upload(params)
      .promise()
      .then(async data => {
        if (data) {
          fs.unlinkSync(process.cwd() + '/' + avatarFile.path); // Empty temp folder
          const locationUrl = data.Location;

          await this.events.update({ banner: locationUrl }, { where: { id: eventId } });
          const updatedEvent: Event = await this.events.findByPk(eventId, { attributes: ['banner'] });
          return updatedEvent;
        } else {
          throw new HttpException(409, 'We could not upload you event banner now, try again later');
        }
      })
      .catch(err => {
        logger.error(err.message, err.code);
        throw new HttpException(500, "You can't upload event banner for now, we are working to fix it");
      });
    return result;
  }

  public async uploadCompetitionBanner({ competitionId, avatarFile }): Promise<Competition> {
    const findCompetition: Competition = await this.competitions.findByPk(competitionId);
    if (!findCompetition) throw new HttpException(409, 'Competition is not registered');

    const arr = avatarFile.originalname.split('.');
    const fileExt = arr[arr.length - 1];
    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(avatarFile.path),
      Key: `${this.EVENT_BANNER_KEY}/${competitionId}.${fileExt}`,
    };

    const result = await this.s3
      .upload(params)
      .promise()
      .then(async data => {
        if (data) {
          fs.unlinkSync(process.cwd() + '/' + avatarFile.path); // Empty temp folder
          const locationUrl = data.Location;

          await this.competitions.update({ banner: locationUrl }, { where: { id: competitionId } });
          const update: Competition = await this.competitions.findByPk(competitionId, { attributes: ['banner'] });
          return update;
        } else {
          throw new HttpException(409, 'We could not upload you competition banner now, try again later');
        }
      })
      .catch(err => {
        logger.error(err.message, err.code);
        throw new HttpException(500, "You can't upload competition banner for now, we are working to fix it");
      });
    return result;
  }
}

export default UploadService;
