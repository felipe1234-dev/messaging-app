import { HTTPRouter } from "@typings";
import { useRouteController, useRouteMiddleware } from "@utils";
import { authenticationMiddleware } from "@middlewares/routes";
import { 
    getUserFriendsController, 
    sendFriendRequestController
} from "@controllers/routes/friends";

const friendsRouter: HTTPRouter = (api, io) => {
    api.get(
        "/get/friends", 
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(getUserFriendsController, io)
    );
    api.get(
        "/send/friend/request/to/:friendUid",
        useRouteMiddleware(authenticationMiddleware, io), 
        useRouteController(sendFriendRequestController, io)
    );
};

export default friendsRouter;