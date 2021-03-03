import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { RequestWithUser } from '../interfaces/auth.interface';
import { Admin, User } from '../interfaces/domain.interface';
import AdminService from '../services/admin.service';
import UploadService from '../services/upload.service';
import UserService from '../services/users.service';

class AdminController {
  public userService = new UserService();
  public adminService = new AdminService();
  public uploadService = new UploadService();

  public getAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    try {
      const findAllUsersData: Admin = await this.adminService.findAdminById(userId);
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const findOneUserData: Admin = await this.adminService.findAdminById(id);
      res.status(200).json({ data: findOneUserData, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public updateAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const userData: Admin = req.body;

    try {
      const data: Admin = await this.adminService.updateAdmin(userId, userData);
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    try {
      const deleteUserData: User = await this.userService.deleteUserData(userId);
      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public updateMember = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const userData: CreateUserDto = req.body;

    try {
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;
