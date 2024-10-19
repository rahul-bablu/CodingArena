import { Room } from "../models/room.model";

export const create = async (params: any) => {
    await Room.create(params);
}

export async function getRoom(id: number) {
    const room = await Room.findByPk(id);
    if (!room) throw 'Room not found';
    return room;
}

// Find the room by its name
export async function getRoomByName(roomName: string, include?: any) {
    const room = await Room.findOne({
        where: {
            name: roomName,
        },
        include: include,
    });

    if (!room)
        throw 'Room not found'

    return room;
}

export async function _delete(id: number) {
    const room = await getRoom(id);
    await room.destroy();
}

export const getAll = async () => {
    return await Room.findAll({ attributes: ['id', 'name'] });
}