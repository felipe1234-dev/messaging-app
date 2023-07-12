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
        const friend = await usersDB.getByUid(friendUid);

        if (friend) {
            await usersDB.uid(friendUid).update({
                friends: Array.from(
                    new Set(friend.friends.filter((uid) => uid !== user.uid))
                ),
            });
        }

        await usersDB.uid(user.uid).update({
            friends: Array.from(
                new Set(user.friends.filter((uid) => uid !== friend?.uid))
            ),
        });

        await FriendRequestsDB.removeFriendRequestWithFriend(user.uid, friendUid);

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
