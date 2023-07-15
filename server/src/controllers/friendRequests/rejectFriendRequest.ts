import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { FriendRequestsDB } from "@databases";
import { MissingURLParam, ServerError, Unauthenticated } from "@errors";

const rejectFriendRequestController: RouteController = async (
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

        await friendRequestsDB.uid(friendRequestUid).update({
            accepted: false,
            rejected: true,
            rejectedAt: new Date(),
        });

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REQUEST_REJECTED,
            message: "Friend request rejected successfully",
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default rejectFriendRequestController;
