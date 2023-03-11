import { Router } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares/routes";
import {
    addChatAdminController,
    addChatMemberController,
    createChatController,
    getChatMessagesController,
    deleteChatController,
    updateChatController,
    removeChatMemberController
} from "@controllers/routes/chats";

const chatsRouter: Router = (api, socket, io) => {
    api.put(
        "/create/chat", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(createChatController, socket, io)
    );
    api.get(
        "/chat/:chatUid/messages",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(getChatMessagesController, socket, io)
    );
    api.patch(
        "/add/chat/admin",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(addChatAdminController, socket, io)
    );
    api.patch(
        "/add/chat/member",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(addChatMemberController, socket, io)
    );
    api.delete(
        "/delete/chat/:chatUid",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(deleteChatController, socket, io)
    );
    api.patch(
        "/update/chat/:chatUid",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(updateChatController, socket, io)
    );
    api.delete(
        "/remove/chat/member",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(removeChatMemberController, socket, io)
    );
};


export default chatsRouter;