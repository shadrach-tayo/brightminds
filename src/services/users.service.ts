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

  public async findAllUser(params: any = {}): Promise<User[]> {
    const searchFields = ['firstname', 'lastname', 'username', 'email', 'school'];
    const addressFields = ['lga', 'state'];
    const exactFields = ['gender'];
    // const dateFields = ['startDate', 'endDate'];

    const searchText: string = params.search;
    delete params.search;

    // build address filter
    let addressFilter = {};
    const addressFilterArr = [];
    if (params[addressFields[0]] || params[addressFields[1]]) {
      addressFields.forEach(key => {
        params[key] && addressFilterArr.push({ [key]: { [Op.startsWith]: `${params[key]}` } });
        // params[key] && (addressFilter[key] = { [Op.startsWith]: `${params[key]}` });
        delete params[key];
      });

      addressFilter = {
        [Op.and]: addressFilterArr,
      };
    }

    // construct date options
    // const dateOptionsArr = [];

    const filterArr: any[] = Object.keys(params)
      .filter(key => !!params[key])
      .map(key => {
        // if (dateFields.includes(key)) {

        // };

        if (exactFields.includes(key)) {
          // make query more strict for columns like gender
          return { [key]: { [Op.startsWith]: `${params[key]}` } };
        }
        return { [key]: { [Op.regexp]: params[key] } };
      });

    // add random search for other fields to filter if included in params
    if (searchText) {
      searchFields.forEach(value => {
        filterArr.push({ [value]: { [Op.like]: `%${searchText}` } });
      });
    }

    const filter = {
      [Op.or]: filterArr,
    };

    let allUser: User[];

    if (filterArr.length > 0) {
      allUser = await this.users.findAll({
        where: filter,
        attributes: { exclude: ['addressId'] },
        include: [{ model: DB.sequelize.models.Address, where: addressFilter, required: true }],
      });
    } else {
      allUser = await this.users.findAll({ attributes: { exclude: ['addressId'] }, include: [{ all: true }] });
    }
    return allUser;
  }

  public async findUserById(userId: string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const query = await DB.sequelize.query('SELECT * FROM users left join subscription on subscription.user_id = ? where users.id = ?;', {
      replacements: [userId, userId],
      type: sequelize.QueryTypes.SELECT,
      model: DB.sequelize.models.Users,
    });

    const findUser = query[0];

    if (!findUser) throw new HttpException(409, 'User not found');

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
