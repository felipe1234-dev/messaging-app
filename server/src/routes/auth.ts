import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    refreshSessionController,
    registerUserController,
    loginUserController,
    logoutUserController,
    recoverPasswordController,
} from "@controllers/auth";

const authRouter: HTTPRouter = (api) => {
    api.post("/auth/session", useRouteController(refreshSessionController));
    api.post("/auth/register", useRouteController(registerUserController));
    api.post("/auth/login", useRouteController(loginUserController));
    api.post(
        "/auth/logout/",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(logoutUserController)
    );
    api.post(
        "/auth/forgot-password/:userUid",
        useRouteController(recoverPasswordController)
    );
};

export default authRouter;
