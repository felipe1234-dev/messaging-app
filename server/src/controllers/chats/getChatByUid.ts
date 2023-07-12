import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { ChatsDB } from "@databases";
import { MissingURLParam, NotFound, ServerError, Unauthorized } from "@errors";

const getChatByUidController: RouteController = async (
    req: Request & {
        params: {
            chatUid?: string;
        };
    },
    res
) => {
    try {
        const { chatUid } = req.params;
        if (!chatUid) throw new MissingURLParam("chatUid");

        const chatsDB = new ChatsDB();

        const chat = await chatsDB.getByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");

        return res.sendResponse({
            status: 200,
            code: codes.CHAT_FETCHED,
            message: "Chat fetched successfully",
            chat,
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default getChatByUidController;
