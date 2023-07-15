import { Request, RouteController } from "@typings";
import { ChatsDB, UsersDB } from "@databases";
import { codes } from "messaging-app-globals";
import {
    Forbidden,
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthenticated,
    Unauthorized,
} from "@errors";

const addChatAdminController: RouteController = async (
    req: Request & {
        params: {
            chatUid?: string;
            memberUid?: string;
        };
    },
    res
) => {
    try {
        const { chatUid, memberUid } = req.params;

        if (!chatUid) throw new MissingURLParam("chat");
        if (!memberUid) throw new MissingURLParam("admin");

        const chatsDB = new ChatsDB();
        const usersDB = new UsersDB();

        const chat = await chatsDB.getByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const admin = await usersDB.getByUid(memberUid);
        if (!admin) throw new NotFound("User not found");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthenticated("You're not authenticated");

        const canAddAdmins = chat.admins.includes(currentUser.uid);
        if (!canAddAdmins)
            throw new Unauthorized(
                "You are not allowed to add admins to this chat"
            );

        const isMember = chat.members.includes(admin.uid);
        if (!isMember)
            throw new NotFound("This user is not a member of the chat");

        const isAlreadyAdmin = chat.admins.includes(admin.uid);
        if (isAlreadyAdmin) throw new Forbidden("User is already an admin");

        await chatsDB.uid(chatUid).update({
            admins: [...chat.admins, admin.uid],
        });

        return res.sendResponse({
            status: 200,
            code: codes.ADMIN_ADDED,
            message: "Admin added successfully",
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default addChatAdminController;
