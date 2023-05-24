import { generateUid, toDate } from "../functions";

class User {
    public uid: string;
    public name: string;
    public email: string;
    public bio: string;
    public photo: string;
    public cover: string;
    public salt: string;
    public password: string;
    public admin: boolean;
    public deleted: boolean;
    public deletedBy?: string;
    public deletedAt?: Date;
    public blocked: boolean;
    public blockedBy?: string;
    public blockedAt?: Date;
    public unblockedAt?: Date;
    public unblockedBy?: string;
    public online: boolean;
    public token?: string;
    public sessionStart?: Date;
    public sessionEnd?: Date;
    public refreshToken?: string;
    public rememberMeToken?: string;
    public friends: string[];
    public recoveryToken?: string;
    public createdAt: Date;

    constructor(data: Partial<User> = {}) {
        const {
            uid = generateUid("user-", 5 + 25),
            name = "No name",
            email = "",
            bio = "",
            photo = "",
            cover = "",
            salt = "",
            password = "",
            admin = false,
            deleted = false,
            deletedAt,
            deletedBy,
            blocked = false,
            blockedBy,
            blockedAt,
            unblockedAt,
            unblockedBy,
            online = false,
            friends = [],
            createdAt = new Date(),
            token = "",
            refreshToken,
            rememberMeToken,
            sessionStart = new Date(),
            sessionEnd = new Date(),
            recoveryToken = "",
        } = data;

        this.uid = uid;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.photo = photo;
        this.cover = cover;
        this.salt = salt;
        this.password = password;
        this.admin = admin;

        this.deleted = deleted;
        if (deletedAt) this.deletedAt = toDate(deletedAt);
        if (deletedBy) this.deletedBy = deletedBy;

        this.blocked = blocked;
        if (blockedAt) this.blockedAt = toDate(blockedAt);
        if (blockedBy) this.blockedBy = blockedBy;
        if (unblockedAt) this.unblockedAt = toDate(unblockedAt);
        if (unblockedBy) this.unblockedBy = unblockedBy;

        this.online = online;
        this.friends = friends;
        this.createdAt = toDate(createdAt);

        if (token) this.token = token;
        if (refreshToken) this.refreshToken = refreshToken;
        if (sessionStart) this.sessionStart = toDate(sessionStart);
        if (sessionEnd) this.sessionEnd = toDate(sessionEnd);
        if (recoveryToken) this.recoveryToken = recoveryToken;
        if (rememberMeToken) this.rememberMeToken = rememberMeToken;
    }

    public static isUser(obj: any): obj is User {
        return (
            obj instanceof User ||
            (obj instanceof Object &&
                typeof obj.uid === "string" &&
                typeof obj.name === "string" &&
                typeof obj.email === "string" &&
                typeof obj.bio === "string" &&
                typeof obj.photo === "string" &&
                typeof obj.cover === "string" &&
                typeof obj.salt === "string" &&
                typeof obj.password === "string" &&
                typeof obj.admin === "boolean" &&
                obj.createdAt instanceof Date &&
                obj.friends instanceof Array &&
                obj.friends.every((item: any) => typeof item === "string") &&
                typeof obj.online === "boolean" &&
                (obj.sessionStart === undefined ||
                    obj.sessionStart instanceof Date) &&
                (obj.sessionEnd === undefined ||
                    obj.sessionEnd instanceof Date) &&
                (obj.token === undefined || typeof obj.token === "string") &&
                (obj.refreshToken === undefined ||
                    typeof obj.refreshToken === "string") &&
                (obj.rememberMeToken === undefined ||
                    typeof obj.rememberMeToken === "string") &&
                (obj.recoveryToken === undefined ||
                    typeof obj.recoveryToken === "string") &&
                typeof obj.deleted === "boolean" &&
                (obj.deletedBy === undefined ||
                    typeof obj.deletedBy === "string") &&
                (obj.deletedAt === undefined ||
                    obj.deletedAt instanceof Date) &&
                typeof obj.blocked === "boolean" &&
                (obj.blockedBy === undefined ||
                    typeof obj.blockedBy === "string") &&
                (obj.blockedAt === undefined ||
                    obj.blockedAt instanceof Date) &&
                (obj.unblockedAt === undefined ||
                    obj.unblockedAt instanceof Date) &&
                (obj.unblockedBy === undefined ||
                    typeof obj.unblockedBy === "string"))
        );
    }
}

export default User;
