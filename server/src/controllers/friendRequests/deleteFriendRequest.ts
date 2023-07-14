import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { FriendRequestsDB } from "@databases";
import { MissingURLParam, ServerError, Unauthorized } from "@errors";

const deleteFriendRequestController: RouteController = async (
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
        if (!user) throw new Unauthorized("You're not authenticated");

        const friendRequestsDB = new FriendRequestsDB();

        await friendRequestsDB.uid(friendRequestUid).update({
            deleted: true,
            deletedAt: new Date(),
            deletedBy: user.uid,
        });

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REQUEST_CANCELED,
            message: "Friend request canceled successfully",
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default deleteFriendRequestController;
