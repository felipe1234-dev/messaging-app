import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    getChatByUidController,
    createChatController,
    deleteChatController,
    updateChatController,
    addChatMemberController,
    removeChatMemberController,
    addChatAdminController,
    getChatMembersController,
    getChatMessagesController,
    getUserChatsController,
} from "@controllers/chats";

const chatsRouter: HTTPRouter = (api) => {
    // Create and query chats
    api.post(
        "/chats",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(createChatController)
    );
    api.get(
        "/chats",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserChatsController)
    );

    // Specific chat
    api.get(
        "/chats/:chatUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getChatByUidController)
    );
    api.put(
        "/chats/:chatUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(updateChatController)
    );
    api.delete(
        "/chats/:chatUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(deleteChatController)
    );

    // Chat messages
    api.get(
        "/chats/:chatUid/messages",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getChatMessagesController)
    );
    
    // Chat members
    api.get(
        "/chats/:chatUid/members",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getChatMembersController)
    );
    api.post(
        "/chats/:chatUid/members/:userUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(addChatMemberController)
    );
    api.post(
        "/chats/:chatUid/admins/:memberUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(addChatAdminController)
    );
    api.delete(
        "/chats/:chatUid/members/:memberUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(removeChatMemberController)
    );
};

export default chatsRouter;
