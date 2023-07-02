import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    getUserFriendsController,
    sendFriendRequestController,
} from "@controllers/friends";

const friendsRouter: HTTPRouter = (api) => {
    api.get(
        "/friends",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserFriendsController)
    );
    api.post(
        "/friends/request/:userUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(sendFriendRequestController)
    );
};

export default friendsRouter;
