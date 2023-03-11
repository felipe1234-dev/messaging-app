import { HTTPRouter } from "@typings";
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

const chatsRouter: HTTPRouter = (api, io) => {
    api.put(
        "/create/chat", 
        useRouteMiddleware(authenticationMiddleware, io),
        useRouteController(createChatController, io)
    );
    api.get(
        "/chat/:chatUid/messages",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(getChatMessagesController, io)
    );
    api.patch(
        "/add/chat/admin",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(addChatAdminController, io)
    );
    api.patch(
        "/add/chat/member",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(addChatMemberController, io)
    );
    api.delete(
        "/delete/chat/:chatUid",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(deleteChatController, io)
    );
    api.patch(
        "/update/chat/:chatUid",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(updateChatController, io)
    );
    api.delete(
        "/remove/chat/member",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(removeChatMemberController, io)
    );
};


export default chatsRouter;