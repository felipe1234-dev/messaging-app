import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    getUserFriendRequestsController,
    sendFriendRequestController,
    deleteFriendRequestController,
    acceptFriendRequestController,
    rejectFriendRequestController,
} from "@controllers/friendRequests";

const friendRequestsRouter: HTTPRouter = (api) => {
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
    api.post(
        "/friend-requests/:friendRequestUid/accept",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(acceptFriendRequestController)
    );
    api.post(
        "/friend-requests/:friendRequestUid/reject",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(rejectFriendRequestController)
    );
};

export default friendRequestsRouter;
