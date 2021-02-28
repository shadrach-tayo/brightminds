import bcrypt, { hash } from 'bcrypt';
import { CreateAdminDto, CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { Admin, User } from '../interfaces/domain.interface';
import DB from '../../database';
import { hashPassword, isEmpty } from '../utils/util';
import { InvalidData } from '../exceptions';

class AdminService {
  public users = DB.Users;
  public admins = DB.Admins;
  public address = DB.Address;

  // public async findAllUser(): Promise<User[]> {
  //   const allUser: User[] = await this.users.findAll({ include: [{ all: true }] });
  //   return allUser;
  // }

  public async findAdminById(userId: string): Promise<Admin> {
    if (isEmpty(userId)) throw new InvalidData();

    const findAdmin: Admin = await this.admins.findByPk(userId);
    if (!findAdmin) throw new HttpException(409, 'Admin not found');

    return findAdmin;
  }

  public async updateAdmin(adminId: string, adminData: Admin): Promise<Admin> {
    if (isEmpty(adminData)) throw new InvalidData();

    const findAdmin: Admin = await this.admins.findByPk(adminId);
    if (!findAdmin) throw new HttpException(409, 'Admin not registered');

    let hashedPassword;
    if (adminData.password) {
      hashedPassword = await hashPassword(adminData.password);
      adminData.password = hashedPassword;
    }

    await this.admins.update({ ...adminData }, { where: { id: adminId } });

    const data: Admin = await this.admins.findByPk(adminId);
    return data;
  }

  // public async deleteadminData(userId: number): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

  //   const findUser: User = await this.users.findByPk(userId);
  //   if (!findUser) throw new HttpException(409, "You're not user");

  //   await this.users.destroy({ where: { id: userId } });

  //   return findUser;
  // }
}

export default AdminService;
