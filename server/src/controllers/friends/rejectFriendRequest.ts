import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { FriendRequestsDB } from "@databases";
import { MissingURLParam, ServerError, Unauthorized } from "@errors";

const rejectFriendRequestController: RouteController = async (
    req: {
        params: {
            friendUid?: string;
        };
    } & Request,
    res
) => {
    try {
        const { friendUid } = req.params;
        if (!friendUid) throw new MissingURLParam("friendUid");

        const { user } = req;
        if (!user) throw new Unauthorized("You're not authenticated");

        await FriendRequestsDB.removeFriendRequestWithFriend(
            user.uid,
            friendUid
        );

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REQUEST_CANCELED,
            message: "Friend request canceled successfully",
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default rejectFriendRequestController;
