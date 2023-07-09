import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    getUserFriendsController,
    getUserFriendRequestsController,
    sendFriendRequestController,
} from "@controllers/friends";

const friendsRouter: HTTPRouter = (api) => {
    api.get(
        "/friends",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserFriendsController)
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
};

export default friendsRouter;
