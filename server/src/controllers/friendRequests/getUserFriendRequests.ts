import { RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { FriendRequestsDB } from "@databases";
import { ServerError, Unauthenticated } from "@errors";

const getUserFriendRequestsController: RouteController = async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Unauthenticated("You're not authenticated");

        const friendRequestsDB = new FriendRequestsDB();
        const friendRequests = await friendRequestsDB.getUserFriendRequests(
            user.uid
        );

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REQUESTS_FETCHED,
            message: "Friend requests fetched successfully",
            friendRequests,
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default getUserFriendRequestsController;
