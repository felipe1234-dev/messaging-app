import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { UsersDB } from "@databases";
import {
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthenticated,
} from "@errors";

const getUserByUidController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        };
    },
    res
) => {
    try {
        const { userUid } = req.params;
        if (!userUid) throw new MissingURLParam("userUid");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthenticated("You're not authenticated");

        const usersDB = new UsersDB();

        const user = await usersDB.getByUid(userUid);
        if (!user) throw new NotFound("User not found");

        return res.sendResponse({
            status: 200,
            code: codes.USER_FETCHED,
            message: "User fetched successfully",
            user,
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default getUserByUidController;
