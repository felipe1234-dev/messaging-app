import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { FriendRequestsDB, UsersDB } from "@databases";
import {
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthenticated,
    Unauthorized,
} from "@errors";

const acceptFriendRequestController: RouteController = async (
    req: {
        params: {
            friendRequestUid?: string;
        };
    } & Request,
    res
) => {
    try {
        const { friendRequestUid } = req.params;
        if (!friendRequestUid) throw new MissingURLParam("friendRequestUid");

        const { user } = req;
        if (!user) throw new Unauthenticated("You're not authenticated");

        const friendRequestsDB = new FriendRequestsDB();
        const usersDB = new UsersDB();

        const friendRequest = await friendRequestsDB.getByUid(friendRequestUid);
        if (!friendRequest) throw new NotFound("Friend request not found");

        if (friendRequest.to !== user.uid)
            throw new Unauthorized("This friend request was not sent to you");

        await friendRequestsDB.uid(friendRequestUid).update({
            accepted: true,
            acceptedAt: new Date(),
            rejected: false,
        });

        const friendUid = friendRequest.from;

        await usersDB.uid(user.uid).addFriend(friendUid);
        await usersDB.uid(friendUid).addFriend(user.uid);

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REQUEST_ACCEPTED,
            message: "Friend request accepted successfully",
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default acceptFriendRequestController;
