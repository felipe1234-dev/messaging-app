import { Request, RouteController } from "@typings";
import { codes, Chat } from "messaging-app-globals";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";
import { ChatsDB } from "@databases";

const updateChatController: RouteController = async (
    req: Request & {
        params: {
            chatUid?: string;
        };
        body: Partial<Chat>
    },
    res
) => {
    try {
        const { chatUid } = req.params;
        if (!chatUid) throw new MissingURLParam("chatUid");
        
        const chat = await ChatsDB.getChatByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const currentUser = req.user;
        const canUpdateChat = currentUser.admin || chat.admins.includes(currentUser.uid);
        if (!canUpdateChat) 
            throw new Unauthorized("You don't have permission to update this chat");

        const { 
            members, deleted, blocked, uid, createdAt, createdBy,
            ...secureUpdates 
        } = req.body;

        await ChatsDB.updateChat(chatUid, { ...secureUpdates });

        return res.sendResponse({
            status: 200,
            code: codes.CHAT_UPDATED,
            message: "Chat updated successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default updateChatController;