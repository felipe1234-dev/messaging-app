import DBAccess from "@services/DBAccess.class";
import { User } from "messaging-app-globals";

class UsersDB extends DBAccess<User> {
    constructor() {
        super("users");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => new User(data));
    }

    public getByEmail(email: string) {
        this.where("email", "==", email);
        return this.getFirst();
    }

    public async getByRefreshToken(refreshToken: string) {
        this.where("refreshToken", "==", refreshToken);
        return this.getFirst();
    }

    public async getByRememberMeToken(rememberMeToken: string) {
        this.where("rememberMeToken", "==", rememberMeToken);
        return this.getFirst();
    }

    public async addFriend(friendUid: string) {
        if (!this._uid) throw new Error("DBAccess.uid required");

        const user = await this.getByUid(this._uid);
        if (!user) throw new Error("User not found");

        return this.uid(user.uid).update({
            friends: Array.from(new Set([...user.friends, friendUid])),
        });
    }

    public async removeFriend(friendUid: string) {
        if (!this._uid) throw new Error("DBAccess.uid required");

        const user = await this.getByUid(this._uid);
        if (!user) throw new Error("User not found");

        return this.uid(user.uid).update({
            friends: Array.from(
                new Set(user.friends.filter((uid) => uid !== friendUid))
            ),
        });
    }
}

export default UsersDB;
