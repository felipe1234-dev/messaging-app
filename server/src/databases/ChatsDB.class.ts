import DBAccess from "@services/DBAccess.class";
import { Chat } from "messaging-app-globals";

class ChatsDB extends DBAccess<Chat> {
    constructor() {
        super("chats");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => new Chat(data));
    }

    public getUserChats(userUid: string) {
        this.where("members", "array-contains", userUid).and(
            "deleted",
            "==",
            false
        );
        return this.get();
    }

    public async getUserDirects(userUid: string) {
        const chats = await this.getUserChats(userUid);
        return chats.filter((chat) => chat.isDirectChat);
    }

    public async getUserGroupChats(userUid: string) {
        const chats = await this.getUserChats(userUid);
        return chats.filter((chat) => chat.isGroupChat);
    }
}

export default ChatsDB;
