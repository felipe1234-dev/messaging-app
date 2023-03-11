import { Router } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares/routes";
import { sendMessageController } from "@controllers/routes/messages";

const messagesRouter: Router = (api, socket, io) => {
    api.put(
        "/send/:type/message", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(sendMessageController, socket, io)
    );
};

export default messagesRouter;