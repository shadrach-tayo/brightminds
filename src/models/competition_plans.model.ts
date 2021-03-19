import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CompetitionPlans {
  id?: string;
  competitionId: string;
  planId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CompetitionPlansCreationAttributes = Optional<CompetitionPlans, 'competitionId' | 'planId'>;

export class CompetitionPlansModel extends Model<any, CompetitionPlansCreationAttributes> {
  public id?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function competitionPlansFactory(sequelize: Sequelize, { CompetitionModel, PlansModel }): typeof CompetitionPlansModel {
  CompetitionPlansModel.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      tableName: 'competition_plans',
      modelName: 'CompetitionPlans',
      sequelize,
    },
  );

  CompetitionPlansModel.belongsTo(CompetitionModel, { as: 'competition' });
  CompetitionPlansModel.belongsTo(PlansModel, { as: 'plan' });

  CompetitionPlansModel.sync({ alter: true });

  return CompetitionPlansModel;
}
