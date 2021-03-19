import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface EventsPlan {
  id?: string;
  eventId: string;
  planId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EventsPlanCreationAttributes = Optional<EventsPlan, 'eventId' | 'planId'>;

export class EventsPlanModel extends Model<any, EventsPlanCreationAttributes> {
  public id?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function eventsPlanFactory(sequelize: Sequelize, { EventModel, PlansModel }): typeof EventsPlanModel {
  EventsPlanModel.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      tableName: 'events_plan',
      modelName: 'EventsPlan',
      sequelize,
    },
  );

  EventsPlanModel.belongsTo(EventModel, { as: 'event' });
  EventsPlanModel.belongsTo(PlansModel, { as: 'plan' });
  // EventsPlanModel.sync({ alter: true });

  return EventsPlanModel;
}
