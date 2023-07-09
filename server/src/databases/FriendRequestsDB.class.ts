import DBAccess from "@services/DBAccess.class";
import { FriendRequest } from "messaging-app-globals";

const friendRequestsCollection = () => new DBAccess("friendRequests");

class FriendRequestsDB {
    public static createFriendRequest(
        friendRequest: FriendRequest
    ): Promise<Date> {
        return friendRequestsCollection()
            .doc(friendRequest.uid)
            .create(friendRequest);
    }

    public static async getFriendRequestByUid(
        uid: string
    ): Promise<FriendRequest | undefined> {
        const friendRequest = (
            await friendRequestsCollection()
                .where("uid", "==", uid)
                .and("deleted", "==", false)
                .get<FriendRequest>()
        )[0];

        if (!friendRequest) return undefined;

        return new FriendRequest(friendRequest);
    }

    public static async getUserFriendRequests(
        userUid: string
    ): Promise<FriendRequest[]> {
        const friendRequests = await friendRequestsCollection()
            .where("from", "==", userUid)
            .and("deleted", "==", false)
            .or("to", "==", userUid)
            .and("deleted", "==", false)
            .get<FriendRequest>();

        return friendRequests.map((data) => new FriendRequest(data));
    }

    public static updateFriendRequest(
        uid: string,
        updates: Partial<FriendRequest>
    ): Promise<Date> {
        return friendRequestsCollection().doc(uid).update(updates);
    }

    public static deleteFriendRequest(uid: string): Promise<Date> {
        return friendRequestsCollection().doc(uid).delete();
    }

    public static async friendRequestAlreadySent(
        from: string,
        to: string
    ): Promise<boolean> {
        const friendRequest = (
            await friendRequestsCollection()
                .where("from", "==", from)
                .and("to", "==", to)
                .get<FriendRequest>()
        )[0];

        return !!friendRequest;
    }
}

export default FriendRequestsDB;
