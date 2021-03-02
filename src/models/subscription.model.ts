import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Subscription } from '../interfaces/domain.interface';

export type SubscriptionCreationAttributes = Optional<Subscription, 'date_subscribed' | 'date_unsubscribed'>;

export class SubscriptionModel extends Model<Subscription, SubscriptionCreationAttributes> implements Subscription {
  public id: string;
  public userId?: string;
  public valid_to: string;
  public valid_from: string;
  public status: number;
  public amount: string;
  public transaction_ref?: string;
  public planId?: string;
  public date_subscribed?: string;
  public date_unsubscribed?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function subscriptionFactory(sequelize: Sequelize, { UserModel, PlansModel }): typeof SubscriptionModel {
  SubscriptionModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      valid_from: DataTypes.DATE,

      valid_to: DataTypes.DATE,

      date_subscribed: DataTypes.DATE,

      date_unsubscribed: DataTypes.DATE,

      transaction_ref: {
        type: DataTypes.STRING(255),
        unique: true,
      },
    },
    {
      tableName: 'subscription',
      modelName: 'Subscription',
      sequelize,
    },
  );

  SubscriptionModel.belongsTo(UserModel, { as: 'user' });
  SubscriptionModel.belongsTo(PlansModel, { as: 'plan' });

  return SubscriptionModel;
}
