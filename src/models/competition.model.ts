import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Competition } from '../interfaces/domain.interface';

export type CompetitionCreationAttributes = Optional<Competition, 'banner'>;

export class CompetitionModel extends Model<Competition, CompetitionCreationAttributes> implements Competition {
  public id: string;
  public title: string;
  public description: string;
  public banner: string;
  public opening_date: string;
  public closing_date: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function competitionFactory(sequelize: Sequelize): typeof CompetitionModel {
  CompetitionModel.init(
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

      banner: {
        type: DataTypes.STRING(255),
      },

      opening_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      closing_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'competitions',
      modelName: 'Competitions',
      sequelize,
    },
  );

  CompetitionModel.sync({ alter: true });
  return CompetitionModel;
}
