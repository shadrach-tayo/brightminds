import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Plan } from '../interfaces/domain.interface';

export type PlanCreationAttributes = Optional<Plan, 'description' | 'valid_from' | 'valid_to'>;

export class PlansModel extends Model<Plan, PlanCreationAttributes> implements Plan {
  public id: string;
  public price: string;
  public valid_to?: string;
  public plan_name: string;
  public valid_from?: string;
  public is_active: boolean;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function plansFactory(sequelize: Sequelize): typeof PlansModel {
  PlansModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      is_active: DataTypes.BOOLEAN,

      plan_name: DataTypes.STRING(255),

      description: DataTypes.STRING(255),

      price: DataTypes.INTEGER,

      valid_from: DataTypes.DATE,

      valid_to: {
        type: DataTypes.DATE,
        defaultValue: new Date(new Date().getFullYear(), 11, 31),
      },
    },
    {
      tableName: 'plan',
      modelName: 'Plan',
      sequelize,
    },
  );

  return PlansModel;
}
