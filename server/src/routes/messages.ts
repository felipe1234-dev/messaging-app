import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import { sendMessageController } from "@controllers/messages";

const messagesRouter: HTTPRouter = (api) => {
    api.put(
        "/send/:type/message",
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(sendMessageController)
    );
};

export default messagesRouter;