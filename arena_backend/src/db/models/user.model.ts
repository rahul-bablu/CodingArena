import { Model, DataTypes, Association, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyHasAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelize } from '../common';
import { Problem } from './problem.model';
import { Contest } from './contest.model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DEV = 'dev',
}

class User extends Model {
  static associations: {
    problems: Association<User, Problem>;
  };

  declare id: number;
  declare username: string;
  declare phash: string;
  declare email: string;
  declare role: UserRole;
  declare addProblem: HasManyAddAssociationMixin<Problem, number>;
  declare hasProblem: HasManyHasAssociationMixin<Problem, number>;
  declare addProblems: HasManyAddAssociationsMixin<Problem, number>;
  declare addContest: HasManyAddAssociationMixin<Contest, number>;
  declare getContests: HasManyGetAssociationsMixin<Contest>;
}

User.init(
  {
    id: {
      // type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    phash: {
      type: new DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: UserRole.USER,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['phash'] }
  },
  scopes: {
      withHash: { }
  },
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);



export { User };
