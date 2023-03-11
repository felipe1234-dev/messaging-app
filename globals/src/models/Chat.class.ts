import generateUid from "../functions/generateUid";

class Chat {
    public uid: string;
    public title: string;
    public description: string;
    public cover: string;
    public blocked: string[];
    public members: string[];
    public admins: string[];
    public deleted: boolean;
    public deletedAt?: Date;
    public deletedBy?: string;
    public createdAt: Date;
    public createdBy: string;

    constructor(data: Partial<Chat> = {}) {
        const {
            uid = generateUid("chat-", 5 + 25),
            title = "",
            description = "",
            cover = "",
            blocked = [],
            members = [],
            admins = [],
            deleted = false,
            deletedAt,
            deletedBy,
            createdAt = new Date(),
            createdBy = ""
        } = data;

        this.uid = uid;
        this.title = title;
        this.description = description;
        this.cover = cover;
        this.blocked = blocked;
        this.members = members;
        this.admins = admins;

        this.deleted = deleted;
        if (deletedAt) this.deletedAt = deletedAt;
        if (deletedBy) this.deletedBy = deletedBy;
        
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        
    }
}

export default Chat;