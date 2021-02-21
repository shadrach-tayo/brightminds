import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Invoice } from '../interfaces/domain.interface';

export type InvoiceCreationAttributes = Optional<Invoice, 'description'>;

export class InvoiceModel extends Model<Invoice, InvoiceCreationAttributes> implements Invoice {
  public id: string;
  public description?: string;
  public userId?: string;
  public amount: string;
  public planId?: string;
  public date_paid: string;
  transaction_ref: string;
  public subscriptionId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function invoiceFactory(sequelize: Sequelize, { UserModel, PlansModel, SubscriptionModel }): typeof InvoiceModel {
  InvoiceModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      amount: DataTypes.INTEGER,

      transaction_ref: DataTypes.STRING(255),

      date_paid: DataTypes.DATE,
    },
    {
      tableName: 'invoice',
      modelName: 'Invoice',
      sequelize,
    },
  );

  InvoiceModel.belongsTo(UserModel);
  InvoiceModel.belongsTo(PlansModel);
  InvoiceModel.belongsTo(SubscriptionModel);

  return InvoiceModel;
}
