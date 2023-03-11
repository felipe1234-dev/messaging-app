import { Router } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares/routes";
import { 
    refreshSessionController,
    registerUserController, 
    loginUserController, 
    blockUserController,
    unblockUserController,
    deleteUserController,
    updateUserController,
    logoutUserController,
    recoverPasswordController
} from "@controllers/routes/users";

const usersRouter: Router = (api, socket, io) => {
    api.post(
        "/refresh/session", 
        useRouteController(refreshSessionController, socket, io)
    );
    api.put(
        "/register", 
        useRouteController(registerUserController, socket, io)
    );
    api.post(
        "/login", 
        useRouteController(loginUserController, socket, io)
    );
    api.post(
        "/logout/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(logoutUserController, socket, io)
    );
    api.delete(
        "/block/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(blockUserController, socket, io)
    );
    api.patch(
        "/unblock/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(unblockUserController, socket, io)
    );
    api.delete(
        "/delete/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io),
        useRouteController(deleteUserController, socket, io)
    );
    api.patch(
        "/update/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(updateUserController, socket, io)
    );
    api.post(
        "/recover/password/:userUid", 
        useRouteController(recoverPasswordController, socket, io)
    );
}; 

export default usersRouter;