import DBAccess from "@services/DBAccess.class";
import { FriendRequest } from "messaging-app-globals";

class FriendRequestsDB extends DBAccess<FriendRequest> {
    constructor() {
        super("friendRequests");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => new FriendRequest(data));
    }

    public getUserFriendRequests(userUid: string) {
        return this.where("from", "==", userUid)
            .and("deleted", "==", false)
            .or("to", "==", userUid)
            .and("deleted", "==", false)
            .get();
    }

    public async alreadySent(from: string, to: string) {
        return !!(
            await this.where("from", "==", from)
                .and("to", "==", to)
                .and("deleted", "==", false)
                .get()
        )[0];
    }
}

export default FriendRequestsDB;
