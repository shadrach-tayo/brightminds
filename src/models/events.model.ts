import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Event } from '../interfaces/domain.interface';

export type EventCreationAttributes = Optional<Event, 'addressId'>;

export class EventModel extends Model<Event, EventCreationAttributes> implements Event {
  public id: string;
  public title: string;
  public description: string;
  public image_url: string;
  public start_date: string;
  public end_date: string;
  public event_time: string;

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

      description: DataTypes.STRING(255),

      banner: DataTypes.STRING(255),

      start_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      end_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      event_time: {
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
  EventModel.sync({ alter: true });
  return EventModel;
}
