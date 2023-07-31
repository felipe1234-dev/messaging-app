import { Request, RouteController } from "@typings";
import { Message, codes } from "messaging-app-globals";
import { ChatsDB, MessagesDB } from "@databases";
import {
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthenticated,
    Unauthorized,
} from "@errors";

const getChatMessagesController: RouteController = async (
    req: Request & {
        params: {
            chatUid?: string;
        };
        query: {
            limit?: number;
            startAfter?: string;
            orderBy?: string; // orderBy=propName,direction
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
        if (!currentUser) throw new Unauthenticated("You're not authenticated");

        const canSeeChat =
            chat.members.includes(currentUser.uid) || currentUser.admin;
        if (!canSeeChat)
            throw new Unauthorized("You are not allowed to see this chat");

        const isBlocked = chat.blocked.includes(currentUser.uid);
        if (isBlocked) throw new Unauthorized("You are blocked in this chat");

        const canSeeDeletedMessages =
            currentUser.admin || chat.admins.includes(currentUser.uid);
        const {
            limit = Infinity,
            startAfter,
            orderBy = "createdAt,desc",
        } = req.query;
        const [field, direction] = orderBy.split(",");

        let query = new MessagesDB();

        query.where("chat", "==", chatUid);

        if (!canSeeDeletedMessages) query.where("deleted", "==", false);
        if (startAfter) query.startAfter(startAfter);
        if (limit) query.limit(limit);

        query.orderBy(
            field as keyof Message,
            direction === "desc" ? "desc" : "asc"
        );

        let messages = await query.get();

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
