import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { MissingURLParam, NotFound, ServerError, Unauthorized } from "@errors";
import { ChatsDB, MessagesDB } from "@databases";

const getChatMessagesController: RouteController = async (
    req: Request & {
        params: {
            chatUid?: string;
        };
        query: {
            limit?: string;
            startAfter?: string;
        };
    },
    res
) => {
    try {
        const { chatUid } = req.params;
        if (!chatUid) throw new MissingURLParam("chatUid");

        const chat = await ChatsDB.getChatByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");

        const canSeeChat =
            chat.members.includes(currentUser.uid) || currentUser.admin;
        if (!canSeeChat)
            throw new Unauthorized("You are not allowed to see this chat");

        const isBlocked = chat.blocked.includes(currentUser.uid);
        if (isBlocked) throw new Unauthorized("You are blocked in this chat");

        let { limit: limitQuery, startAfter } = req.query;
        const limit = limitQuery ? Number(limitQuery) : Infinity;

        let messages = await MessagesDB.getChatMessages(
            chatUid,
            limit,
            startAfter
        );

        const canSeeDeletedMessages =
            currentUser.admin || chat.admins.includes(currentUser.uid);
        if (!canSeeDeletedMessages) {
            messages = messages.filter((msg) => !msg.deleted);
        }

        return res.sendResponse({
            status: 200,
            code: codes.MESSAGES_FETCHED,
            message: "Messages fetched successfully",
            messages,
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default getChatMessagesController;
