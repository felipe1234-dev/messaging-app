import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import { uploadFileController } from "@controllers/media";

const mediaRouter: HTTPRouter = (api) => {
    api.post(
        "/media",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(uploadFileController)
    );
};

export default mediaRouter;
