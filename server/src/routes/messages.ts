import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares/routes";
import { sendMessageController } from "@controllers/routes/messages";

const messagesRouter: HTTPRouter = (api, io) => {
    api.put(
        "/send/:type/message", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(sendMessageController, io)
    );
};

export default messagesRouter;