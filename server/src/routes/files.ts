import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import {
    authenticationMiddleware,
    formDataParserMiddleware,
} from "@middlewares";
import { uploadImageController } from "@controllers/files";

const filesRouter: HTTPRouter = (api) => {
    api.post(
        "/files/images",
        useRouteMiddleware(authenticationMiddleware),
        useRouteMiddleware(formDataParserMiddleware),
        useRouteController(uploadImageController)
    );
};

export default filesRouter;
