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

        const chatsDB = new ChatsDB();
        const usersDB = new UsersDB();

        const chat = await chatsDB.getByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const member = await usersDB.getByUid(userUid);
        if (!member) throw new NotFound("User not found");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthenticated("You're not authenticated");

        const canAddMembers = chat.admins.includes(currentUser.uid);
        if (!canAddMembers)
            throw new Unauthorized(
                "You are not allowed to add members to this chat"
            );

        const isAlreadyMember = chat.members.includes(member.uid);
        if (!isAlreadyMember)
            throw new Forbidden("This user is already a member");

        await chatsDB.uid(chatUid).update({
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
