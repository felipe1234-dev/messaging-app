import { Request, RouteController } from "@typings";
import { codes, User } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";

const updateUserController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        };
        body: Partial<User>
    },
    res
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