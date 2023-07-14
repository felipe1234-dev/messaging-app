import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { UsersDB, FriendRequestsDB } from "@databases";
import { MissingURLParam, NotFound, ServerError, Unauthorized } from "@errors";

const removeFriendController: RouteController = async (
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

        const isFriendsWithThem = user.friends.includes(friendUid);
        if (!isFriendsWithThem) throw new NotFound("Friend not found");
        
        const usersDB = new UsersDB();
        const friendRequestsDB = new FriendRequestsDB();

        const friend = await usersDB.getByUid(friendUid);

        if (friend) {
            await usersDB.uid(friendUid).removeFriend(user.uid);
            await usersDB.uid(user.uid).removeFriend(friend.uid);
        }

        const friendRequests = await friendRequestsDB
            .where("from", "==", user.uid)
            .and("to", "==", friendUid)
            .and("deleted", "==", false)
            .or("from", "==", friendUid)
            .and("to", "==", user.uid)
            .and("deleted", "==", false)
            .get();

        for (const friendRequest of friendRequests) {
            await FriendRequestsDB.updateFriendRequest(friendRequest.uid, {
                deleted: true,
                deletedAt: new Date(),
                deletedBy: user.uid,
            });
        }

        res.sendResponse({
            status: 200,
            code: codes.FRIEND_REMOVED,
            message: "Friend removed successfully",
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default removeFriendController;
