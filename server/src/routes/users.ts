import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
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
} from "@controllers/users";

const usersRouter: HTTPRouter = (api) => {
    api.post(
        "/refresh/session", 
        useRouteController(refreshSessionController)
    );
    api.put(
        "/register", 
        useRouteController(registerUserController)
    );
    api.post(
        "/login", 
        useRouteController(loginUserController)
    );
    api.post(
        "/logout/:userUid", 
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(logoutUserController)
    );
    api.delete(
        "/block/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(blockUserController)
    );
    api.patch(
        "/unblock/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(unblockUserController)
    );
    api.delete(
        "/delete/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(deleteUserController)
    );
    api.patch(
        "/update/user/:userUid", 
        useRouteMiddleware(authenticationMiddleware), 
        useRouteController(updateUserController)
    );
    api.post(
        "/recover/password/:userUid", 
        useRouteController(recoverPasswordController)
    );
    api.post(
        "/search/users/",
        useRouteController(searchUsersController)
    )
}; 

export default usersRouter;