import { RouteController } from "@typings";
import { Chat, codes } from "messaging-app-globals";
import { ChatsDB } from "@databases";
import { ServerError, Unauthorized } from "@errors";

const getUserChatsController: RouteController = async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Unauthorized("You're not authenticated");

        const chats: Chat[] = await ChatsDB.getUserChats(user.uid);

        res.sendResponse({
            status: 200,
            code: codes.CHATS_FETCHED,
            message: "Chats fetched successfully",
            chats
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default getUserChatsController;