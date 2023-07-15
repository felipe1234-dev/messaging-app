import { RouteController } from "@typings";
import { User, codes, secureUserData } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { ServerError, Unauthenticated } from "@errors";

const getUserFriendsController: RouteController = async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Unauthenticated("You're not authenticated");

        const usersDB = new UsersDB();
        let friends: User[] = [];

        for (const friendUid of user.friends) {
            const friend = await usersDB.getByUid(friendUid);
            if (friend) friends.push(friend);
        }

        if (!user.admin) {
            friends = friends.map(secureUserData);
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
