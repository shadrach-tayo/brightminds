import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { User } from '../interfaces/domain.interface';
import UploadService from '../services/upload.service';
import UserService from '../services/users.service';

class UsersController {
  public userService = new UserService();
  public uploadService = new UploadService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    try {
      const findOneUserData: User = await this.userService.findUserById(userId);
      res.status(200).json({ data: findOneUserData, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const createUserData: User = await this.userService.createUser(userData);
      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const userData: CreateUserDto = req.body;

    try {
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public uploadUserAvater = async (req: RequestWithFile, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const avatarFile = req.file;

    try {
      const updateUserData = await this.uploadService.uploadUserAvatar({ userId, avatarFile });
      // console.log('result ', updateUserData);
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      // console.log('upload error ', error);
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);

    try {
      const deleteUserData: User = await this.userService.deleteUserData(userId);
      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
