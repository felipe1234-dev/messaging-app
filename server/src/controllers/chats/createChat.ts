import { Request, RouteController } from "@typings";
import { codes, Chat } from "messaging-app-globals";
import { ServerError, Unauthorized } from "@errors";
import { ChatsDB } from "@databases";

const createChatController: RouteController = async (
    req: Request & {
        body: Partial<Chat>;
    },
    res
) => {
    try {
        const chatProps = req.body;
        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");

        const newChat = new Chat({
            ...chatProps,
            admins: Array.from(
                new Set([currentUser.uid, ...(chatProps.admins || [])])
            ),
            members: Array.from(
                new Set([currentUser.uid, ...(chatProps.members || [])])
            ),
            createdBy: currentUser.uid,
        });

        await ChatsDB.createChat(newChat);

        return res.sendResponse({
            status: 200,
            code: codes.CHAT_CREATED,
            message: "Chat created successfully",
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default createChatController;
