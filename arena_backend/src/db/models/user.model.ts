import { Association, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model } from 'sequelize';
import { sequelize } from '../common';
import { Contest } from './contest.model';
import { Problem } from './problem.model';

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
  declare isVerified: boolean;
  declare addProblem: HasManyAddAssociationMixin<Problem, number>;
  declare hasProblem: HasManyHasAssociationMixin<Problem, number>;
  declare addProblems: HasManyAddAssociationsMixin<Problem, number>;
  declare addContest: HasManyAddAssociationMixin<Contest, number>;
  declare getContests: HasManyGetAssociationsMixin<Contest>;
}

class VerifyToken extends Model {
  declare id: number;
  declare userId: number;
  declare token: string;
}

VerifyToken.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    onDelete: "cascade",
    onUpdate: "cascade",
    references: { model: "users", key: "id" },
  },
  token: {
    type: DataTypes.STRING,
  },
}, { sequelize, })

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
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
      withHash: {}
    },
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

User.hasOne(VerifyToken, {
  as: 'token',
  foreignKey:"userId"
})

VerifyToken.belongsTo(User, {
  as: 'user',
  foreignKey:"userId"
})

export { User, VerifyToken };

