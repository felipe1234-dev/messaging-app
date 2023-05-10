import { codes, FilterParams, secureUserData } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { RouteController, Request } from "@typings";
import { ServerError, Unauthorized } from "@errors";

const searchUsersController: RouteController = async (
    req: Request & {
        body: FilterParams
    },
    res
) => {
    try {
        const currentUser = req.user;
        if (!currentUser?.admin) throw new Unauthorized("You don't have permission to search for users");

        const filterParams = req.body;
        const users = await UsersDB.getUsers(filterParams);

        return res.sendResponse({
            status: 200,
            code: codes.USERS_FETCHED,
            message: "Users fetched successfully",
            users: users.map(user => secureUserData(user))
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default searchUsersController;