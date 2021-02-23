import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { TransactionStatus } from '../interfaces/domain.enum';
import { Transaction } from '../interfaces/domain.interface';

export type TransactionCreationAttributes = Optional<Transaction, 'event' | 'competition'>;

export class TransactionModel extends Model<Transaction, TransactionCreationAttributes> implements Transaction {
  public id: string;
  public transaction_ref: string;
  public status: TransactionStatus;
  public amount_paid: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function transactionFactory(sequelize: Sequelize): typeof TransactionModel {
  TransactionModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      transaction_ref: DataTypes.STRING(255),

      status: DataTypes.STRING(45),

      amount_paid: DataTypes.INTEGER,
    },
    {
      tableName: 'transactions',
      modelName: 'Transactions',
      sequelize,
    },
  );

  return TransactionModel;
}
