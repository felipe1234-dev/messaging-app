import { Router } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares/routes";
import { 
    getUserFriendsController, 
    sendFriendRequestController
} from "@controllers/routes/friends";

const friendsRouter: Router = (api, socket, io) => {
    api.get(
        "/get/friends", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(getUserFriendsController, socket, io)
    );
    api.get(
        "/send/friend/request/to/:friendUid",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(sendFriendRequestController, socket, io)
    );
};

export default friendsRouter;