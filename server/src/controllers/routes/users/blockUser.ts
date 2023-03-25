import { RouteController, Request } from "@typings";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";
import { ChatsDB, UsersDB } from "@databases";
import { codes, events } from "messaging-app-globals";

const blockUserController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        }
    },
    res,
    next,
    io
) => {
    try {
        const currentUser = req.user;
        if (!currentUser?.admin) throw new Unauthorized("You don't have permission to block users");

        const { userUid } = req.params;
        if (!userUid) throw new MissingURLParam("userUid");

        const userToBeBlocked = await UsersDB.getUserByUid(userUid);
        if (!userToBeBlocked) throw new NotFound("User not found");

        await UsersDB.updateUser(userUid, { 
            blocked: true,
            blockedAt: new Date(),
            blockedBy: currentUser.uid
        });

        const blockedUser = await UsersDB.getUserByUid(userUid);        
        io.to(`user:${userUid}`).emit(events.USER_UPDATED, blockedUser);
        io.to(`friend:${userUid}`).emit(events.FRIEND_UPDATED, blockedUser);

        const chats = await ChatsDB.getUserChats(userUid);
        for (const chat of chats) {
            io.to(`chat:${chat.uid}`).emit(events.USER_UPDATED, blockedUser);
        }

        return res.sendResponse({
            status: 200,
            code: codes.USER_BLOCKED,
            message: "User blocked successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default blockUserController;