import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Address, Charge, Competition, Transaction } from '../interfaces/domain.interface';

export type CompetitionCreationAttributes = Optional<Competition, 'transaction' | 'charge' | 'address'>;

export class CompetitionModel extends Model<Competition, CompetitionCreationAttributes> implements Competition {
  public id: string;
  public title: string;
  public description: string;
  public image_url: string;
  public startDate: string;
  public endDate: string;
  public transaction: Transaction;
  public charge?: Charge;
  public address: Address;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function competitionFactory(sequelize: Sequelize): typeof CompetitionModel {
  CompetitionModel.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      title: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      description: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      image_url: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      startDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      endDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'competitions',
      modelName: 'Competitions',
      sequelize,
    },
  );

  // CompetitionModel.belongsTo(AddressModel, { as: 'address' });
  // CompetitionModel.belongsTo(AddressModel, { foreignKey: 'charge' }); // link to charge
  // CompetitionModel.belongsTo(TransactionModel, { as: 'transaction' }); // transaction

  return CompetitionModel;
}
