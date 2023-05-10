import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { 
    MissingHeaderParam,
    NotFound, 
    ServerError,
    Unauthorized 
} from "@errors";

const logoutUserController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        };
    },
    res
) => {
    try {
        const { userUid } = req.params;
        if (!userUid) throw new MissingHeaderParam("userUid");

        const currentUser = req.user;
        if (currentUser?.uid !== userUid) throw new Unauthorized("You're not authorized");

        const user = await UsersDB.getUserByUid(userUid);
        if (!user) throw new NotFound("User not found");

        user.online = false;
        user.sessionEnd = new Date();
        user.token = "";
        user.refreshToken = "";
        user.rememberMeToken = "";

        await UsersDB.updateUser(user.uid, { ...user });
        
        return res.sendResponse({
            status: 200,
            code: codes.LOGGED_OUT,
            message: "User logged out successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default logoutUserController;