import { RouteController } from "@typings";
import { User, codes } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { ServerError, Unauthorized } from "@errors";

const getUserFriendsController: RouteController = async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Unauthorized("You're not authenticated");

        const friends: User[] = [];

        for (const friendUid of user.friends) {
            const friend = await UsersDB.getUserByUid(friendUid);
            if (friend) friends.push(friend);
        }

        res.sendResponse({
            status: 200,
            code: codes.FRIENDS_FETCHED,
            message: "Friends fetched successfully",
            friends,
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default getUserFriendsController;
