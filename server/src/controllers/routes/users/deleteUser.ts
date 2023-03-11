import { Request, RouteController } from "@typings";
import { codes, events } from "messaging-app-globals";
import { MissingURLParam, NotFound, ServerError, Unauthorized } from "@errors";
import { UsersDB } from "@databases";

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
        io.to(`user:${userUid}`).emit(events.USER_UPDATED, updatedUser);
        io.to(`friend:${userUid}`).emit(events.FRIEND_UPDATED, updatedUser);

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