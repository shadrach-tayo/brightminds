import jwt from 'jsonwebtoken';
import { UserTypeEnum } from '../common/UserTypeEnum';
import DB from '../database';
import { CreateAdminDto, CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { Address, Admin, User } from '../interfaces/domain.interface';
import { isEmpty, isPasswordMatching } from '../utils/util';

class AuthService {
  public users = DB.Users;
  public admins = DB.Admins;
  public address = DB.Address;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `the email ${userData.email} already exists`);

    if (!userData.address) throw new HttpException(400, 'Invalid Address data');
    const userAddress: Address = await this.address.create(userData.address);

    const role = UserTypeEnum.MEMBER;
    const createUserData: User = await this.users.create({ ...userData, role, addressId: userAddress.id });

    return createUserData;
  }

  public async createAdmin(userData: CreateAdminDto): Promise<Admin> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findAdmin: Admin = await this.admins.findOne({ where: { email: userData.email } });
    if (findAdmin) throw new HttpException(409, `the email ${userData.email} already exists`);

    const role = UserTypeEnum.ADMIN;
    const createUserData: Admin = await this.admins.create({ ...userData, role });

    return createUserData;
  }

  public async loginAdmin(userData: CreateAdminDto): Promise<{ token: string; user: Admin }> {
    if (isEmpty(userData)) throw new HttpException(400, 'Invalid input');

    const user: Admin = await this.admins.findOne({ where: { email: userData.email } });
    if (!user) throw new HttpException(409, `The email ${userData.email} was not found`);

    if (!(await isPasswordMatching(userData.password, user.password))) throw new HttpException(409, 'Incorrect email or password');

    const tokenData = this.createToken(user);

    return { token: tokenData.token, user };
  }

  public async login(userData: CreateUserDto): Promise<{ token: string; user: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'Invalid input');

    const user: User = await this.users.findOne({ where: { phoneNumber: userData.phoneNumber } });
    if (!user) throw new HttpException(409, `The number ${userData.phoneNumber} is not registered`);

    if (!(await isPasswordMatching(userData.password, user.password))) throw new HttpException(409, 'Incorrect phone number or password');

    const tokenData = this.createToken(user);

    return { token: tokenData.token, user };
  }

  public async logout(): Promise<boolean> {
    // if (isEmpty(userData)) throw new HttpException(400, 'Invalid input');

    // const findUser: User = await this.users.findOne({ password: userData.password });
    // if (!findUser) throw new HttpException(409, "You're not a user");

    return true;
  }

  public createToken(user: User | Admin): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60 * 24;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
