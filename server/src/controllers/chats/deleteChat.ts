import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { MissingURLParam, NotFound, ServerError, Unauthorized } from "@errors";
import { ChatsDB } from "@databases";

const deleteChatController: RouteController = async (
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

        const canDeleteChat =
            currentUser.admin || chat.admins.includes(currentUser.uid);
        if (!canDeleteChat)
            throw new Unauthorized(
                "You don't have permission to delete this chat"
            );

        await chatsDB.uid(chatUid).update({ deleted: true });

        return res.sendResponse({
            status: 200,
            code: codes.CHAT_DELETED,
            message: "Chat deleted successfully",
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default deleteChatController;
