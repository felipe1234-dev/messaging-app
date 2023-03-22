import { generateUid, toDate } from "../functions";

class FriendRequest {
    public uid: string;
    public from: string;
    public to: string;
    public accepted: boolean;
    public acceptedAt?: Date;
    public rejected: boolean;
    public rejectedAt?: Date;
    public sentAt: Date;
    public deleted: boolean;
    public deletedAt?: Date;
    public deletedBy?: string;

    constructor(data: Partial<FriendRequest> = {}) {
        const {
            uid = generateUid("friendRequest-", 14 + 25),
            from = "",
            to = "",
            accepted = false,
            acceptedAt,
            rejected = false,
            rejectedAt,
            sentAt = new Date(),
            deleted = false,
            deletedAt,
            deletedBy
        } = data;

        this.uid = uid;
        this.from = from;
        this.to = to;
        this.accepted = accepted;
        if (acceptedAt) this.acceptedAt = toDate(acceptedAt);
        this.rejected = rejected;
        if (rejectedAt) this.rejectedAt = toDate(rejectedAt);
        this.sentAt = toDate(sentAt);
        this.deleted = deleted;
        if (deletedAt) this.deletedAt = toDate(deletedAt);
        if (deletedBy) this.deletedBy = deletedBy;
    }
}

export default FriendRequest;