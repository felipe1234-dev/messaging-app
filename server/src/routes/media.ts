import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import { uploadImageController } from "@controllers/media";

const mediaRouter: HTTPRouter = (api) => {
    api.post(
        "/media/images",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(uploadImageController)
    );
};

export default mediaRouter;
