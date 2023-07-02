import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    searchUsersController,
    
    getUserByUidController,
    updateUserController,
    deleteUserController,

    blockUserController,
    unblockUserController,
} from "@controllers/users";

const usersRouter: HTTPRouter = (api) => {
    api.get("/users/", useRouteController(searchUsersController));

    api.get(
        "/users/:userUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserByUidController)
    );
    api.put(
        "/users/:userUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(updateUserController)
    );
    api.delete(
        "/users/:userUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(deleteUserController)
    );

    api.put(
        "/users/:userUid/block",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(blockUserController)
    );
    api.put(
        "/users/:userUid/unblock",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(unblockUserController)
    );
};

export default usersRouter;
