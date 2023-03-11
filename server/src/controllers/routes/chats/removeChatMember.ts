import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import {
    Forbidden,
    MissingPostParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";
import { ChatsDB, UsersDB } from "@databases";

const removeChatMemberController: RouteController = async (
    req: Request & {
        body: {
            chat?: string;
            member?: string;
        }
    },
    res
) => {
    try {
        const { chat: chatUid, member: memberUid } = req.body;

        if (!chatUid) throw new MissingPostParam("chat");
        if (!memberUid) throw new MissingPostParam("member");

        const chat = await ChatsDB.getChatByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const member = await UsersDB.getUserByUid(memberUid);
        if (!member) throw new NotFound("User not found");
        
        const currentUser = req.user;
        const canRemoveMembers = chat.admins.includes(currentUser.uid);
        if (!canRemoveMembers) throw new Unauthorized("You are not allowed to add members to this chat");

        const isNotAMember = !chat.members.includes(member.uid);
        if (isNotAMember) throw new Forbidden("This user is not a member");

        await ChatsDB.updateChat(chatUid, { 
            members: chat.members.filter(uid => uid !== member.uid) 
        });

        return res.sendResponse({
            status: 200,
            code: codes.MEMBER_REMOVED,
            message: "Member removed successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default removeChatMemberController;