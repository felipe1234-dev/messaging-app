import { RouteController } from "@typings";
import { Chat, codes } from "messaging-app-globals";
import { ChatsDB } from "@databases";
import { ServerError, Unauthenticated } from "@errors";

const getUserChatsController: RouteController = async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Unauthenticated("You're not authenticated");

        const chatsDB = new ChatsDB();

        const chats: Chat[] = await chatsDB.getUserChats(user.uid);

        res.sendResponse({
            status: 200,
            code: codes.CHATS_FETCHED,
            message: "Chats fetched successfully",
            chats,
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default getUserChatsController;
