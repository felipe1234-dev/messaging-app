import DBAccess from "@services/DBAccess.class";
import { User } from "messaging-app-globals";

class UsersDB extends DBAccess<User> {
    constructor() {
        super("users");
    }

    public override async get() {
        const results = await super.get();
        return results.map(data => new User(data));
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
}

export default UsersDB;
