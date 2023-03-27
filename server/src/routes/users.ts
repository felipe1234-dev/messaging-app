import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware, getConnectedSocketMiddleware } from "@middlewares/routes";
import { 
    refreshSessionController,
    registerUserController, 
    loginUserController, 
    blockUserController,
    unblockUserController,
    deleteUserController,
    updateUserController,
    logoutUserController,
    recoverPasswordController,
    searchUsersController
} from "@controllers/routes/users";

const usersRouter: HTTPRouter = (api, io) => {
    api.post(
        "/refresh/session", 
        useRouteController(refreshSessionController, io)
    );
    api.put(
        "/register", 
        useRouteController(registerUserController, io)
    );
    api.post(
        "/login", 
        useRouteMiddleware(getConnectedSocketMiddleware, io),
        useRouteController(loginUserController, io)
    );
    api.post(
        "/logout/:userUid", 
        useRouteMiddleware(getConnectedSocketMiddleware, io),
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(logoutUserController, io)
    );
    api.delete(
        "/block/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(blockUserController, io)
    );
    api.patch(
        "/unblock/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(unblockUserController, io)
    );
    api.delete(
        "/delete/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io),
        useRouteController(deleteUserController, io)
    );
    api.patch(
        "/update/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(updateUserController, io)
    );
    api.post(
        "/recover/password/:userUid", 
        useRouteController(recoverPasswordController, io)
    );
    api.post(
        "/search/users/",
        useRouteController(searchUsersController, io)
    )
}; 

export default usersRouter;