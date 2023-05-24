import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares";
import {
    getUserFriendsController,
    sendFriendRequestController,
} from "@controllers/friends";

const friendsRouter: HTTPRouter = (api) => {
    api.get(
        "/get/friends",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(getUserFriendsController)
    );
    api.get(
        "/send/friend/request/to/:friendUid",
        useRouteMiddleware(authenticationMiddleware),
        useRouteController(sendFriendRequestController)
    );
};

export default friendsRouter;
