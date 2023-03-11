import generateUid from "../functions/generateUid";

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
        if (deletedAt) this.deletedAt = deletedAt;
        if (deletedBy) this.deletedBy = deletedBy;

        this.blocked = blocked;
        if (blockedAt) this.blockedAt = blockedAt;
        if (blockedBy) this.blockedBy = blockedBy;
        if (unblockedAt) this.unblockedAt = unblockedAt;
        if (unblockedBy) this.unblockedBy = unblockedBy;

        this.online = online;
        this.friends = friends;
        this.createdAt = createdAt;

        if (token) this.token = token;
        if (refreshToken) this.refreshToken = refreshToken;
        if (sessionStart) this.sessionStart = sessionStart;
        if (sessionEnd) this.sessionEnd = sessionEnd;
        if (recoveryToken) this.recoveryToken = recoveryToken;
        if (rememberMeToken) this.rememberMeToken = rememberMeToken;
    }
}

export default User;