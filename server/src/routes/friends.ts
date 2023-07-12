import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    getUserFriendsController,
    getUserFriendRequestsController,
    sendFriendRequestController,
    removeFriendController,
    cancelFriendRequestController,
} from "@controllers/friends";

const friendsRouter: HTTPRouter = (api) => {
    api.get(
        "/friends",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserFriendsController)
    );
    api.delete(
        "/friends/:friendUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(removeFriendController)
    );

    api.get(
        "/friend-requests",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserFriendRequestsController)
    );
    api.post(
        "/friend-requests/:userUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(sendFriendRequestController)
    );
    api.delete(
        "/friend-requests/:friendUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(cancelFriendRequestController)
    );
};

export default friendsRouter;
