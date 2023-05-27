import DBAccess from "@services/DBAccess.class";
import { Message } from "messaging-app-globals";

const msgCollection = () => new DBAccess("messages");

class MessagesDB {
    public static createMessage(msg: Message): Promise<Date> {
        return msgCollection().doc(msg.uid).create(msg);
    }

    public static async getMessageByUid(
        uid: string
    ): Promise<Message | undefined> {
        return (
            await msgCollection()
                .where("uid", "==", uid)
                .and("deleted", "==", false)
                .get<Message>()
        )[0];
    }

    public static updateMessage(
        uid: string,
        updates: Partial<Message>
    ): Promise<Date> {
        return msgCollection().doc(uid).update(updates);
    }

    public static getChatMessages(
        chatUid: string,
        filters: {
            orderBy?: [field: string, direction: "desc" | "asc"];
            startAfter?: string;
            limit?: number;
        }
    ): Promise<Message[]> {
        let query = msgCollection().where("chat", "==", chatUid);

        const { orderBy, startAfter, limit } = filters;
        if (orderBy) query = query.orderBy(...orderBy);
        if (startAfter) query = query.startAfter(startAfter);
        if (limit) query = query.limit(limit);

        return query.get();
    }
}

export default MessagesDB;
