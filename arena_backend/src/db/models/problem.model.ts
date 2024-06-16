import {
  Model, DataTypes, HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  ForeignKey,
  HasManyCreateAssociationMixin,
  NonAttribute,
  Association,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  BelongsToGetAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasOne,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin
} from 'sequelize';
import { sequelize } from '../common';
import { User } from './user.model';
import { Contest } from './contest.model';

class ProblemIO extends Model {
  declare problemId: ForeignKey<Problem['id']>;

  declare id: number;
  declare input: string;
  declare score: number;
  declare output: string;
}

class Problem extends Model {
  declare id: number;
  declare title: string;
  declare q: string;
  declare maxscore: number;
  declare problemio?: NonAttribute<ProblemIO[]>;
  declare input: string;
  declare output: string;
  declare addUser: HasManyAddAssociationMixin<User, number>;
  declare addUsers: HasManyAddAssociationsMixin<User, number>;
  declare addProblemIO: HasManyAddAssociationMixin<ProblemIO, number>;
  declare removeProblemIO: HasManyRemoveAssociationMixin<ProblemIO, number>;
  declare getProblemIOs: HasManyGetAssociationsMixin<ProblemIO>;
  declare getContest: BelongsToGetAssociationMixin<Contest>;
  declare countUsers: HasManyCountAssociationsMixin;
  declare hasUser: HasManyHasAssociationMixin<User, number>;
  declare getStaterCode: HasOneGetAssociationMixin<StaterCode>;
  declare createStaterCode: HasOneCreateAssociationMixin<StaterCode>;
  declare static associations: {
    problemio: Association<Problem, ProblemIO>;
    statercode: Association<Problem, StaterCode>;
  };
}


class StaterCode extends Model {
  declare id: number;
  declare scode: string;
  declare languages: string;
}

class Submissions extends Model {
  declare id: number;
  declare upid: ForeignKey<UserProblems['id']>;
  declare code: string;
  declare verdect: string;
  declare score: number;
  declare lang: string;
}

class UserProblems extends Model {
  declare id: number;
  declare score: number;
  declare accsubid: number;
  declare submissions?: NonAttribute<Submissions[]>;
  declare getSubmissions: HasManyGetAssociationsMixin<Submissions>;
  declare createSubmission: HasManyCreateAssociationMixin<Submissions, 'upid'>;
  declare static associations: {
    submissions: Association<UserProblems, Submissions>;
  };
}


Submissions.init(
  {
    id: {
      // type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    lang: {
      type: DataTypes.STRING(10),

    },
    code: {
      type: DataTypes.TEXT,
    },
    verdect: {
      type: DataTypes.STRING(128),
    },
    score: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
  }, {
  sequelize,
  tableName: 'Submissions',
},
)


Problem.init(
  {
    id: {
      // type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    input: {
      type: new DataTypes.STRING(256),
    },
    output: {
      type: new DataTypes.STRING(256),
    },
    maxscore: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    q: {
      type: new DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Problems',
    tableName: 'problems',
  }
);

ProblemIO.init(
  {
    input: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    output: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: 'ProblemIO',
    tableName: 'problemio',
    sequelize,
  }
)

StaterCode.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  scode: {
    type: new DataTypes.TEXT,
  },
  languages: {
    type: new DataTypes.TEXT,
  },
}, { sequelize })

UserProblems.init({
  id: {
    // type: DataTypes.UUID,
    // defaultValue: DataTypes.UUIDV4,
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  accsubid: {
    type: DataTypes.INTEGER.UNSIGNED,

  },
  score: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, { sequelize });

// A problem can have multiple inputs and outputs
ProblemIO.belongsTo(Problem, { targetKey: 'id', foreignKey: 'problemId' })
Problem.hasMany(ProblemIO, { sourceKey: 'id', foreignKey: 'problemId' })

Problem.hasOne(StaterCode);
StaterCode.hasOne(Problem, { onDelete: 'CASCADE', hooks: true })

// A user can solve many problems and a problem can have multpile solved users
User.belongsToMany(Problem, { through: UserProblems, });
Problem.belongsToMany(User, { through: UserProblems, });

// A user can have multiple submissions for a problem
Submissions.belongsTo(UserProblems, { targetKey: 'id', foreignKey: 'upid', onDelete: 'CASCADE', hooks: true });
UserProblems.hasMany(Submissions, { sourceKey: 'id', foreignKey: 'upid', onDelete: 'CASCADE', hooks: true });

export { Problem, UserProblems, ProblemIO, Submissions };
