import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Ticket } from '../interfaces/domain.interface';

export type TicketCreationAttributes = Optional<Ticket, 'userId' | 'eventId'>;

export class TicketModel extends Model<Ticket, TicketCreationAttributes> implements Ticket {
  public id: string;
  public eventId: string;
  public userId: string;
  public quantity: number;
  public amount_paid: string;
  public transaction_ref: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function TicketFactory(sequelize: Sequelize, { UserModel, EventModel }): typeof TicketModel {
  TicketModel.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      transaction_ref: {
        type: DataTypes.STRING(255),
        unique: true,
      },

      amount_paid: DataTypes.STRING(45),

      quantity: DataTypes.INTEGER,
    },
    {
      tableName: 'tickets',
      modelName: 'Tickets',
      sequelize,
    },
  );

  TicketModel.belongsTo(UserModel, { as: 'user' });
  TicketModel.belongsTo(EventModel, { as: 'event' });
  TicketModel.sync({ alter: true });

  return TicketModel;
}
