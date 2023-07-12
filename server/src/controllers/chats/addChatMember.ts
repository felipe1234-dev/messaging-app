import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { ChatsDB, UsersDB } from "@databases";
import {
    Forbidden,
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthorized,
} from "@errors";

const addChatMemberController: RouteController = async (
    req: Request & {
        params: {
            chatUid?: string;
            userUid?: string;
        };
    },
    res
) => {
    try {
        const { chatUid, userUid } = req.body;

        if (!chatUid) throw new MissingURLParam("chat");
        if (!userUid) throw new MissingURLParam("member");

        const chat = await ChatsDB.getChatByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const member = await UsersDB.getUserByUid(userUid);
        if (!member) throw new NotFound("User not found");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");

        const canAddMembers = chat.admins.includes(currentUser.uid);
        if (!canAddMembers)
            throw new Unauthorized(
                "You are not allowed to add members to this chat"
            );

        const isAlreadyMember = chat.members.includes(member.uid);
        if (!isAlreadyMember)
            throw new Forbidden("This user is already a member");

        await ChatsDB.updateChat(chatUid, {
            members: [...chat.members, member.uid],
        });

        return res.sendResponse({
            status: 200,
            code: codes.MEMBER_ADDED,
            message: "Member added successfully",
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default addChatMemberController;
