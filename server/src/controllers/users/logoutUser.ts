import { RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { ServerError, Unauthenticated } from "@errors";

const logoutUserController: RouteController = async (req, res) => {
    try {
        const currentUser = req.user;
        if (!currentUser?.uid) throw new Unauthenticated("You're not authenticated!");

        await UsersDB.updateUser(currentUser.uid, {
            online: false,
            sessionEnd: new Date(),
            token: "",
            refreshToken: "",
            rememberMeToken: ""
        });

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