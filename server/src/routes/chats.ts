import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    addChatAdminController,
    addChatMemberController,
    createChatController,
    getChatMessagesController,
    deleteChatController,
    updateChatController,
    removeChatMemberController,
    getUserChatsController,
    getChatMembersController
} from "@controllers/chats";

const chatsRouter: HTTPRouter = (api) => {
    api.put(
        "/create/chat", 
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(createChatController)
    );
    api.get(
        "/chat/:chatUid/messages",
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(getChatMessagesController)
    );
    api.get(
        "/chat/:chatUid/members",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getChatMembersController)
    )
    api.patch(
        "/add/chat/admin",
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(addChatAdminController)
    );
    api.patch(
        "/add/chat/member",
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(addChatMemberController)
    );
    api.delete(
        "/delete/chat/:chatUid",
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(deleteChatController)
    );
    api.patch(
        "/update/chat/:chatUid",
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(updateChatController)
    );
    api.delete(
        "/remove/chat/member",
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(removeChatMemberController)
    );
    api.get(
        "/get/chats",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserChatsController)
    );
};


export default chatsRouter;