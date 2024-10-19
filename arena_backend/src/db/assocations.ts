import { Contest, UserContest } from "./models/contest.model";
import { Problem } from "./models/problem.model";
import { Room } from "./models/room.model";
import { User } from "./models/user.model";

Room.belongsToMany(Contest, { through: 'RoomContests', foreignKey: 'roomId', as: 'contests' });
Contest.belongsToMany(Room, { through: 'RoomContests', foreignKey: 'contestId', as: 'rooms' });
Room.belongsToMany(User, { through: 'UsersRooms', foreignKey: 'roomId', as: 'users' });

User.belongsToMany(Contest, { through: UserContest });
Contest.belongsToMany(User, { through: UserContest });

UserContest.belongsTo(User);
UserContest.belongsTo(Contest);

Contest.hasMany(Problem, {
  sourceKey: 'id',
  foreignKey: 'contestId',
  as: 'problems',
});

Problem.belongsTo(Contest, {
  foreignKey: 'contestId',
  as: 'contest',
});

export { Contest, Problem, Room, User, UserContest };

