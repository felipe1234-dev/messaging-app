import DBAccess from "@services/DBAccess.class";
import { Chat } from "messaging-app-globals";

const chatCollection = () => new DBAccess("chats");

class ChatsDB {
    public static createChat(chat: Chat): Promise<Date> {
        return chatCollection().doc(chat.uid).create(chat);
    }

    public static async getChatByUid(uid: string): Promise<Chat | undefined> {
        const chat = (
            await chatCollection()
                .where("uid", "==", uid)
                .and("deleted", "==", false)
                .get<Chat>()
        )[0];

        if (!chat) return undefined;

        return new Chat(chat);
    }

    public static updateChat(
        uid: string,
        updates: Partial<Chat>
    ): Promise<Date> {
        return chatCollection().doc(uid).update(updates);
    }

    public static async getUserChats(userUid: string): Promise<Chat[]> {
        const chats = await chatCollection()
            .where("members", "array-contains", userUid)
            .and("deleted", "==", false)
            .get<Chat>();

        return chats.map((chat) => new Chat(chat));
    }
}

export default ChatsDB;
