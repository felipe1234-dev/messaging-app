import { generateUid, toDate } from "../functions";

class Chat {
    public uid: string;
    public title: string;
    public description: string;
    public thumbnail: string;
    public cover: string;
    public blocked: string[];
    public members: string[];
    public admins: string[];
    public typing: string[];
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
            thumbnail = "",
            cover = "",
            blocked = [],
            members = [],
            admins = [],
            typing = [],
            deleted = false,
            deletedAt,
            deletedBy,
            createdAt = new Date(),
            createdBy = "",
        } = data;

        this.uid = uid;
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
        this.cover = cover;
        this.blocked = blocked;
        this.members = members;
        this.admins = admins;
        this.typing = typing;

        this.deleted = deleted;
        if (deletedAt) this.deletedAt = toDate(deletedAt);
        if (deletedBy) this.deletedBy = deletedBy;

        this.createdAt = toDate(createdAt);
        this.createdBy = createdBy;
    }

    public get isGroupChat() {
        return this.members.length > 2;
    }

    public get isDirectChat() {
        return !this.isGroupChat;
    }

    public static isChat(obj: any): obj is Chat {
        return (
            obj instanceof Chat ||
            (obj instanceof Object &&
                typeof obj.uid === "string" &&
                typeof obj.title === "string" &&
                typeof obj.description === "string" &&
                typeof obj.thumbnail === "string" &&
                typeof obj.cover === "string" &&
                obj.blocked instanceof Array &&
                obj.blocked.every((item: any) => typeof item === "string") &&
                obj.members instanceof Array &&
                obj.members.every((item: any) => typeof item === "string") &&
                obj.admins instanceof Array &&
                obj.admins.every((item: any) => typeof item === "string") &&
                obj.typing instanceof Array &&
                obj.typing.every((item: any) => typeof item === "string") &&
                typeof obj.deleted === "boolean" &&
                (obj.deletedAt === undefined ||
                    toDate(obj.deletedAt) instanceof Date) &&
                (obj.deletedBy === undefined ||
                    typeof obj.deletedBy === "string") &&
                toDate(obj.createdAt) instanceof Date &&
                typeof obj.createdBy === "string")
        );
    }
}

export default Chat;
