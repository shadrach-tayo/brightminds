import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Event } from '../interfaces/domain.interface';

export type EventCreationAttributes = Optional<Event, 'transactionId' | 'chargeId'>;

export class EventModel extends Model<Event, EventCreationAttributes> implements Event {
  public id: string;
  public title: string;
  public description: string;
  public image_url: string;
  public startDate: string;
  public endDate: string;
  public transactionId: string;
  public chargeId?: string;
  public addressId: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function eventFactory(sequelize: Sequelize, { AddressModel }): typeof EventModel {
  EventModel.init(
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
    },
    {
      tableName: 'events',
      modelName: 'Events',
      sequelize,
    },
  );

  EventModel.belongsTo(AddressModel);
  // EventModel.belongsTo(AddressModel, { as: 'charge' }); // link to charge
  // EventModel.belongsTo(TransactionModel); // transaction

  return EventModel;
}
