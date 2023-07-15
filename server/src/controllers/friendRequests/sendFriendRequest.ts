import { RouteController, Request } from "@typings";
import { FriendRequest, codes } from "messaging-app-globals";
import { UsersDB, FriendRequestsDB } from "@databases";
import {
    InvalidParam,
    MissingBodyParam,
    NotFound,
    ServerError,
    Unauthenticated,
} from "@errors";

const sendFriendRequestController: RouteController = async (
    req: Request & {
        body: {
            to?: string;
        };
    },
    res
) => {
    try {
        const { user } = req;
        if (!user) throw new Unauthenticated("You're not authenticated");

        const { to } = req.body;
        if (!to) throw new MissingBodyParam("to");

        const from = user.uid;

        if (user.friends.includes(to))
            throw new InvalidParam("You're already friends with " + to);

        const usersDB = new UsersDB();
        const friendRequestsDB = new FriendRequestsDB();

        const friend = await usersDB.getByUid(to);
        if (!friend) throw new NotFound("Friend not found");

        const alreadySent = await friendRequestsDB.alreadySent(from, to);
        if (alreadySent)
            throw new InvalidParam(
                `You've already sent a friend request to ${friend.name} (UID: ${friend.uid})`
            );

        const friendRequest = new FriendRequest({ from, to });
        await friendRequestsDB.uid(friendRequest.uid).create(friendRequest);

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
