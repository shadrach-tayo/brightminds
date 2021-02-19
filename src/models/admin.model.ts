import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserType } from '../interfaces/domain.enum';
import { Admin } from '../interfaces/domain.interface';
import { hashPassword } from '../utils/util';

export type AdminCreationAttributes = Optional<Admin, 'avatar_url'>;

export class AdminModel extends Model<Admin, AdminCreationAttributes> implements Admin {
  public id: string;
  public email: string;
  public password: string;
  public firstname: string;
  public lastname: string;
  public role: UserType;
  public avatar_url: string;
  public phoneNumber: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function adminFactory(sequelize: Sequelize): typeof AdminModel {
  AdminModel.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      firstname: {
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

      avatar_url: DataTypes.STRING(255),

      phoneNumber: {
        allowNull: false,
        type: DataTypes.STRING(14),
      },
    },
    {
      hooks: {
        beforeCreate: (admin, {}) => {
          return hashPassword(admin.password).then((hashedPassword: string) => {
            admin.password = hashedPassword;
          });
        },
      },
      tableName: 'admins',
      modelName: 'Admins',
      sequelize,
    },
  );

  AdminModel.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return AdminModel;
}
