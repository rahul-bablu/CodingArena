import { sequelize } from "./common";
import { Contest } from "./models/contest.model";
import { Problem, ProblemIO, Submissions, UserProblems } from "./models/problem.model";
import { User, UserRole, VerifyToken } from "./models/user.model";

async function dd() {
  try {
    await sequelize.sync({force:true});
    const u1 =  await User.create({username: "user1", email:'user@user.com', phash:"$2a$10$tfzcc8/tzWqIJO8nf.W49ekD226nSuisOSD1YpjRe1MRZ5qdyb5XS", role: UserRole.ADMIN, isVerified: true}) as any;
    const u2 =  await User.create({username: "user2", email:'user@user.com', phash:"$2a$10$tfzcc8/tzWqIJO8nf.W49ekD226nSuisOSD1YpjRe1MRZ5qdyb5XS", isVerified: true}) as any;
    
    const c1 = await Contest.create({state:"manualactive", title: 'Genesis Contest', startTime:"22 May 2025", endTime: "23 May 2025"});
    const p1 = await Problem.create({title:"Sum Of Arrays",q:'## Reconstruct Itinerary\n\n### Description\nYou are given a list of airline tickets representing a series of flights, where each ticket contains departure and arrival airports. Your task is to reconstruct the itinerary in order, starting from the first airport.\n\nFor example, given the tickets `[["SFO", "HKO"], ["YYZ", "SFO"], ["YUL", "YYZ"], ["HKO", "ORD"]]`, the reconstructed itinerary should be `["YUL", "YYZ", "SFO", "HKO", "ORD"]`.\n\n### Input\n- A list of lists representing airline tickets, where each inner list contains two strings representing departure and arrival airports.\n- The number of tickets is at least 1 and at most 10^4.\n\n### Output\n- A list of strings representing the reconstructed itinerary.\n\n### Max Score\nThe maximum achievable score for this problem is `150`.\n\n### Constraints\n- The input tickets will form a valid itinerary.\n- Each airport is represented by a three-letter code (e.g., "SFO" for San Francisco, "YYZ" for Toronto Pearson International Airport).\n- It is guaranteed that the itinerary is possible and can be reconstructed correctly.\n'});
    // if(!c1 || !p1 || !u1) throw ""

    await c1.addProblem(p1);
    // const p = (await Problem.findByPk(1))?.createStaterCode({scode:`{"c":"Write your own shit"}`, languages:`[ ["c", "C (GCC 9.2.0)"]]`})
    // const up = await UserProblems.findOne({where:{UserId:1, ProblemId:1}});
    // console.log(await up?.getSubmissions())
    // console.log(up?.submissions)
    // const a = await UserProblems.create({score:50, UserId:1, ProblemId:1})
    
  } catch (e) {
    console.error(e);
  }
}
// dd()

const db = {
    sequelize,
    User, VerifyToken, Problem, Contest, ProblemIO, UserProblems, Submissions
}

export default db;