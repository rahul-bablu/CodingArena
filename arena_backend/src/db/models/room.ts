import { DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyRemoveAssociationMixin, Model } from "sequelize";
import { sequelize } from '../common';
import { Contest } from "./contest.model";
import { User } from "./user.model";



class Room extends Model {
  declare id: number;
  declare name: string;
  declare code: string;
  declare desc: string;
  declare open: boolean;

  declare getUsers: HasManyGetAssociationsMixin<User>;
  declare getContests: HasManyGetAssociationsMixin<Contest>;
  declare hasUser: HasManyHasAssociationMixin<User, number>;
  declare addUser: HasManyAddAssociationMixin<User, number>;
  declare removeUser: HasManyRemoveAssociationMixin<User, number>;
  declare addUsers: HasManyAddAssociationsMixin<User, number>;
  declare addContest: HasManyAddAssociationMixin<Contest, number>;
  declare addContests: HasManyAddAssociationsMixin<Contest, number>;
  declare createContest: HasManyCreateAssociationMixin<Contest, 'contestId'>;
  declare countUsers: HasManyCountAssociationsMixin;
}

Room.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.NUMBER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  code: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  desc: DataTypes.STRING,
  open: {
    defaultValue: true,
    type: DataTypes.BOOLEAN,
  }
}, {
  sequelize,
  modelName: 'Room',
});

Room.hasMany(Contest);
Contest.hasMany(Room);

export { Room };

