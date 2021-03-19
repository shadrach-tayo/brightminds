import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { CompetitionEntry } from '../interfaces/domain.interface';

export type CompetitionEntriesCreationAttributes = Optional<CompetitionEntry, 'entry' | 'competitionId' | 'userId'>;

export class CompetitionEntriesModel extends Model<CompetitionEntry, CompetitionEntriesCreationAttributes> {
  public id?: string;
  public entry?: string;
  public userId?: string;
  public competitionId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function competitionEntriesFactory(sequelize: Sequelize, { CompetitionModel, UserModel }): typeof CompetitionEntriesModel {
  CompetitionEntriesModel.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      entry: DataTypes.STRING(255),
    },
    {
      tableName: 'competition_entries',
      modelName: 'competitionEntries',
      sequelize,
    },
  );

  CompetitionEntriesModel.belongsTo(CompetitionModel, { as: 'competition' });
  CompetitionEntriesModel.belongsTo(UserModel, { as: 'user' });

  CompetitionEntriesModel.sync({ alter: true });

  return CompetitionEntriesModel;
}
