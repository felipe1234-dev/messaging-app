import { RouteController, Request } from "@typings";
import { UsersDB } from "@databases";
import { codes } from "messaging-app-globals";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";

const blockUserController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        }
    },
    res
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