import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '../interfaces/domain.interface';
import { hashPassword } from '../utils/util';

export type UserCreationAttributes = Optional<User, 'dob' | 'avatar_url'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id: string;
  public email: string;
  public password: string;
  public firstname: string;
  public lastname: string;
  public role: string;
  public avatar_url: string;
  public dob: string;
  public gender: string;
  public addressId: string;
  public phoneNumber: string;
  public school: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function userFactory(sequelize: Sequelize, { AddressModel }): typeof UserModel {
  UserModel.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(45),
      },

      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      gender: {
        allowNull: false,
        type: DataTypes.STRING(6),
      },

      firstname: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      school: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      lastname: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      role: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      avatar_url: DataTypes.STRING(45),

      dob: DataTypes.DATE,

      phoneNumber: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(14),
      },
    },
    {
      hooks: {
        beforeCreate: (user, _) => {
          return hashPassword(user.password).then((hashedPassword: string) => {
            user.password = hashedPassword;
          });
        },
      },
      tableName: 'users',
      sequelize,
    },
  );

  UserModel.belongsTo(AddressModel);

  return UserModel;
}
