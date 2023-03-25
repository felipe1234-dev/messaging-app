import { Request, RouteController } from "@typings";
import { codes, events } from "messaging-app-globals";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";
import { ChatsDB, UsersDB } from "@databases";
import { User } from "messaging-app-globals";

const updateUserController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        };
        body: Partial<User>
    },
    res,
    next,
    io
) => {
    try {
        const { userUid } = req.params;
        if (!userUid) throw new MissingURLParam("userUid");

        const currentUser = req.user;
        if (!currentUser?.admin && currentUser?.uid !== userUid) 
            throw new Unauthorized("You don't have permission to update this user");

        const userToBeUpdated = await UsersDB.getUserByUid(userUid);
        if (!userToBeUpdated) throw new NotFound("User not found");

        const { 
            admin, password, salt, deleted, blocked, uid, createdAt,
            ...secureUpdates 
        } = req.body;

        await UsersDB.updateUser(userUid, { ...secureUpdates });

        const updatedUser = await UsersDB.getUserByUid(userUid);
        io.to(`user:${userUid}`).emit(events.USER_UPDATED, updatedUser);
        io.to(`friend:${userUid}`).emit(events.FRIEND_UPDATED, updatedUser);

        const chats = await ChatsDB.getUserChats(userUid);
        for (const chat of chats) {
            io.to(`chat:${chat.uid}`).emit(events.USER_UPDATED, updatedUser);
        }

        return res.sendResponse({
            status: 200,
            code: codes.USER_UPDATED,
            message: "User updated successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default updateUserController;