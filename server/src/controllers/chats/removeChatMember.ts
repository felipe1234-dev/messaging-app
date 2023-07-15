import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { ChatsDB, UsersDB } from "@databases";
import {
    Forbidden,
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthenticated,
    Unauthorized,
} from "@errors";

const removeChatMemberController: RouteController = async (
    req: Request & {
        params: {
            chatUid?: string;
            memberUid?: string;
        };
    },
    res
) => {
    try {
        const { chatUid, memberUid } = req.body;

        if (!chatUid) throw new MissingURLParam("chat");
        if (!memberUid) throw new MissingURLParam("member");

        const chatsDB = new ChatsDB();
        const usersDB = new UsersDB();

        const chat = await chatsDB.getByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const member = await usersDB.getByUid(memberUid);
        if (!member) throw new NotFound("User not found");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthenticated("You're not authenticated");

        const canRemoveMembers = chat.admins.includes(currentUser.uid);
        if (!canRemoveMembers)
            throw new Unauthorized(
                "You are not allowed to add members to this chat"
            );

        const isNotAMember = !chat.members.includes(member.uid);
        if (isNotAMember) throw new Forbidden("This user is not a member");

        await chatsDB.uid(chatUid).update({
            members: chat.members.filter((uid) => uid !== member.uid),
        });

        return res.sendResponse({
            status: 200,
            code: codes.MEMBER_REMOVED,
            message: "Member removed successfully",
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default removeChatMemberController;
