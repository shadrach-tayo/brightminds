import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Address } from '../interfaces/domain.interface';

export type AddressCreationAttributes = Optional<Address, 'street' | 'state' | 'lga' | 'city'>;

export class AddressModel extends Model<Address, AddressCreationAttributes> implements Address {
  public id: string;
  public city: string;
  public state: string;
  public lga: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function addressFactory(sequelize: Sequelize): typeof AddressModel {
  AddressModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      city: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },

      state: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },

      lga: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },

      street: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: 'address',
      name: {
        singular: 'address',
      },
      sequelize,
    },
  );

  // AddressModel.belongsTo(AddressModel, { as: 'address' });

  return AddressModel;
}
