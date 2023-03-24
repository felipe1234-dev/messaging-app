import { Request, RouteController } from "@typings";
import { codes, User } from "messaging-app-globals";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";
import { ChatsDB, UsersDB } from "@databases";

const getChatMembersController: RouteController = async (
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

        const chat = await ChatsDB.getChatByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");
        
        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");
        
        const canSeeChat = chat.members.includes(currentUser.uid) || currentUser.admin;
        if (!canSeeChat) throw new Unauthorized("You are not allowed to see this chat");

        const isBlocked = chat.blocked.includes(currentUser.uid);
        if (isBlocked) throw new Unauthorized("You are blocked in this chat");

        const members: User[] = [];
        for (const userUid of chat.members) {
            const user = await UsersDB.getUserByUid(userUid);
            if (!user) continue;
            members.push(user);
        }

        return res.sendResponse({
            status: 200,
            code: codes.MEMBERS_FETCHED,
            message: "Members fetched successfully",
            members
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default getChatMembersController;