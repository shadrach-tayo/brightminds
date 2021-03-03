import bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/domain.interface';
import DB from '../../database';
import { hashPassword, isEmpty } from '../utils/util';
import { InvalidData } from '../exceptions';
import sequelize from 'sequelize';
import { Op } from 'sequelize';

class UserService {
  public users = DB.Users;
  public address = DB.Address;

  public async findAllUser(params: any): Promise<User[]> {
    const filterArr: any[] = Object.keys(params)
      .filter(key => !!params[key])
      .map(key => ({ [key]: { [Op.regexp]: params[key] } }));

    const filter = {
      [Op.or]: filterArr,
    };

    console.log('params ', params);
    console.log('filter ', filter);

    let allUser: User[];
    if (filterArr.length > 0) {
      allUser = await this.users.findAll({ where: filter, include: [{ all: true }] });
    } else {
      allUser = await this.users.findAll({ include: [{ all: true }] });
    }
    return allUser;
  }

  public async findUserById(userId: string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const query = await DB.sequelize.query('SELECT * FROM users inner join subscription on subscription.user_id = ? where users.id = ?;', {
      replacements: [userId, userId],
      type: sequelize.QueryTypes.SELECT,
      model: DB.sequelize.models.Users,
    });

    const findUser = query[0];

    if (!findUser) throw new HttpException(409, 'Users not found');

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

  public async deleteUserData(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User Id cannot be empty');

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, 'User not registered');

    await this.users.destroy({ where: { id: userId } });

    return findUser;
  }
}

export default UserService;
