import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    getUserFriendRequestsController,
    sendFriendRequestController,
    deleteFriendRequestController,
} from "@controllers/friendRequests";

const friendsRouter: HTTPRouter = (api) => {
    api.get(
        "/friend-requests",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserFriendRequestsController)
    );
    api.post(
        "/friend-requests",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(sendFriendRequestController)
    );
    api.delete(
        "/friend-requests/:friendRequestUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(deleteFriendRequestController)
    );
};

export default friendsRouter;
