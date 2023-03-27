import { secureUserData } from '@utils';
import { Request, RouteController } from "@typings";
import { codes, events } from "messaging-app-globals";
import { ChatsDB, UsersDB } from "@databases";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";

const deleteUserController: RouteController = async (
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
        if (!currentUser?.admin) throw new Unauthorized("You don't have permission to delete users");
 
        const { userUid } = req.params;
        if (!userUid) throw new MissingURLParam("userUid");

        const userToBeDeleted = await UsersDB.getUserByUid(userUid);
        if (!userToBeDeleted) throw new NotFound("User not found");

        await UsersDB.updateUser(userUid, { 
            deleted: true,
            deletedAt: new Date(),
            deletedBy: currentUser.uid
        });

        const updatedUser = await UsersDB.getUserByUid(userUid);

        if (updatedUser) {
            const safeData = secureUserData(updatedUser);

            io.to(`user:${userUid}`).emit(events.USER_UPDATED, safeData);
            io.to(`friend:${userUid}`).emit(events.FRIEND_UPDATED, safeData);

            const chats = await ChatsDB.getUserChats(userUid);
            for (const chat of chats) {
                io.to(`chat:${chat.uid}`).emit(events.USER_UPDATED, safeData);
            }
        }

        return res.sendResponse({
            status: 200,
            code: codes.USER_DELETED,
            message: "User deleted successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default deleteUserController;