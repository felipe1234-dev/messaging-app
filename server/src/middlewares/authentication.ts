import configs from "@configs";
import { RouteMiddleware } from "@typings";
import { Token } from "@services";
import { UsersDB } from "@databases";
import { User } from "messaging-app-globals";
import {
    Unauthenticated,
    MissingHeaderParam,
    NotFound,
    Unauthorized,
} from "@errors";

const authenticationMiddleware: RouteMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.sendResponse(new MissingHeaderParam("authorization"));
    }

    if (token === configs.systemHash) {
        const systemUser = new User({
            name: "system",
            admin: true,
        });

        req.user = systemUser;

        console.log("Accessing as system...");

        return next();
    }

    try {
        if (await Token.isExpired(token)) {
            return res.sendResponse(new Unauthenticated("Session expired"));
        }

        const decodedUser = await Token.decode(token);
        const user = await UsersDB.getUserByUid(decodedUser.uid);

        if (!user) return res.sendResponse(new NotFound("User not found"));
        if (user.blocked)
            return res.sendResponse(new Unauthorized("User blocked"));

        const newToken = await Token.encode(user);
        user.token = newToken;

        await UsersDB.updateUser(user.uid, { token: newToken });

        req.user = user;

        console.log(`Accessing as ${user.uid}...`);
        console.log("User name -", user.name);

        return next();
    } catch (error) {
        console.error("Error authenticating user", error);
        return res.sendResponse(
            new Unauthenticated("You're not authenticated")
        );
    }
};

export default authenticationMiddleware;
