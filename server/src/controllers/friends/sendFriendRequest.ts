import { RouteController, Request } from "@typings";
import { FriendRequest, codes } from "messaging-app-globals";
import { UsersDB, FriendRequestsDB } from "@databases";
import {
    InvalidParam,
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthorized,
} from "@errors";

const sendFriendRequestController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        };
    },
    res
) => {
    try {
        const { user } = req;
        if (!user) throw new Unauthorized("You're not authenticated");

        const { userUid } = req.params;
        if (!userUid) throw new MissingURLParam("userUid");

        const to = userUid;
        const from = user.uid;

        if (user.friends.includes(to))
            throw new InvalidParam("You're already friends with " + to);

        const friend = await UsersDB.getUserByUid(userUid);
        if (!friend) throw new NotFound("Friend not found");

        const alreadySent = await FriendRequestsDB.friendRequestAlreadySent(
            from,
            to
        );
        if (alreadySent)
            throw new InvalidParam(
                "You've already sent a friend request to " + to
            );

        const friendRequest = new FriendRequest({ from, to });
        await FriendRequestsDB.createFriendRequest(friendRequest);

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REQUEST_SENT,
            message: "Friend request sent successfully",
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default sendFriendRequestController;
