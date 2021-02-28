import bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/domain.interface';
import DB from '../../database';
import { hashPassword, isEmpty } from '../utils/util';
import { InvalidData } from '../exceptions';

class UserService {
  public users = DB.Users;
  public address = DB.Address;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.users.findAll({ include: [{ all: true }] });
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new InvalidData();

    const findUser: User = await this.users.findByPk(userId, { include: [{ all: true }] });
    if (!findUser) throw new HttpException(409, 'user not registered');

    let hashedPassword;
    if (userData.password) {
      hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
    }

    await this.users.update({ ...userData }, { where: { id: userId } });

    if (!isEmpty(userData.address)) {
      await this.address.update({ ...userData.address }, { where: { id: findUser.addressId } });
    }

    const data: User = await this.users.findByPk(userId, { include: [{ all: true }] });
    return data;
  }

  public async deleteUserData(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.users.destroy({ where: { id: userId } });

    return findUser;
  }
}

export default UserService;
