import { Request, RouteController } from "@typings";
import { codes, secureUserData } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { Token } from "@services";
import {
    Forbidden,
    MissingPostParam,
    NotFound,
    ServerError,
    Unauthenticated,
} from "@errors";

const refreshSessionController: RouteController = async (
    req: Request & {
        body: {
            refreshToken?: string;
        };
    },
    res
) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw new MissingPostParam("refreshToken");

        const user = await UsersDB.getUserByRefreshToken(refreshToken);
        if (!user) throw new NotFound("Token not found");

        if (user.blocked) throw new Forbidden("User blocked");

        const tokenExpired = user.token && await Token.isExpired(user.token);
        if (!user.token || tokenExpired) {
            await UsersDB.updateUser(user.uid, { refreshToken: "" });
            throw new Unauthenticated("Token expired");
        }

        return res.sendResponse({
            status: 200,
            code: codes.SESSION_RECOVERED,
            message: "User session recovered successfully",
            user: secureUserData(user),
            token: user.token,
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default refreshSessionController;
