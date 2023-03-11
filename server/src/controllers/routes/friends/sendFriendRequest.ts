import { RouteController, Request } from "@typings";
import { FriendRequest, codes, events } from "messaging-app-globals";
import { UsersDB, FriendRequestsDB } from "@databases";
import { InvalidParam, MissingPostParam, NotFound, ServerError } from "@errors";

const sendFriendRequestController: RouteController = async (
    req: Request & {
        params: {
            friendUid?: string
        }
    },
    res,
    next,
    socket,
    io
) => {
    try {
        const { user } = req;
        const { friendUid } = req.params;
        if (!friendUid) throw new MissingPostParam("friendUid");
        
        const to = friendUid;
        const from = user.uid;

        if (user.friends.includes(to)) throw new InvalidParam("You're already friends with " + to);
        
        const friend = await UsersDB.getUserByUid(friendUid);
        if (!friend) throw new NotFound("Friend not found");
        
        const alreadySent = await FriendRequestsDB.friendRequestAlreadySent(from, to);
        if (alreadySent) throw new InvalidParam("You've already sent a friend request to " + to);

        const friendRequest = new FriendRequest({ from, to });
        await FriendRequestsDB.createFriendRequest(friendRequest);

        io.to(`user:${friend.uid}`).emit(events.FRIEND_REQUEST_SENT, friendRequest);

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REQUEST_SENT,
            message: "Friend request sent successfully"
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default sendFriendRequestController;