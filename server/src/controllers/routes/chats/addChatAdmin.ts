import { Request, RouteController } from "@typings";
import { 
    Forbidden, 
    MissingPostParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";
import { ChatsDB, UsersDB } from "@databases";
import { codes } from "messaging-app-globals";

const addChatAdminController: RouteController = async (
    req: Request & {
        body: {
            chat?: string;
            admin?: string;
        }
    },
    res
) => {
    try {
        const { chat: chatUid, admin: adminUid } = req.body;

        if (!chatUid) throw new MissingPostParam("chat");
        if (!adminUid) throw new MissingPostParam("admin");

        const chat = await ChatsDB.getChatByUid(chatUid);
        if (!chat) throw new NotFound("Chat not found");

        const admin = await UsersDB.getUserByUid(adminUid);
        if (!admin) throw new NotFound("User not found");
        
        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");

        const canAddAdmins = chat.admins.includes(currentUser.uid);
        if (!canAddAdmins) throw new Unauthorized("You are not allowed to add admins to this chat");

        const isMember = chat.members.includes(admin.uid);
        if (!isMember) throw new NotFound("This user is not a member of the chat");

        const isAlreadyAdmin = chat.admins.includes(admin.uid);
        if (isAlreadyAdmin) throw new Forbidden("User is already an admin");

        await ChatsDB.updateChat(chatUid, { admins: [...chat.admins, admin.uid ] });

        return res.sendResponse({
            status: 200,
            code: codes.ADMIN_ADDED,
            message: "Admin added successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default addChatAdminController;