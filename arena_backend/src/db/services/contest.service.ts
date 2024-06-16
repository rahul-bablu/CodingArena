import { Contest } from "../models/contest.model"

export const create = async (params:{state:string, startTime: Date, endTime: Date}) => {
    if(params.endTime < params.startTime) throw 'end time should be greater than start time';
    await Contest.create(params);
}

export async function _delete(id:number) {
    const contest = await getContest(id);
    await contest.destroy();
}

export async function getContest(id:number) {
    const contest = await Contest.findByPk(id);
    if (!contest) throw 'Contest not found';
    return contest;
}

export const getAll = async () => {
    return await Contest.findAll({attributes:['id', 'title']});
}