import { MissingHeaderParam, SocketNotFound } from "@errors";
import { RouteMiddleware, Socket } from "@typings";

const getConnectedSocketMiddleware: RouteMiddleware = (req, res, next, io) => {
    const socketId = req.headers["socket-id"];
    if (!socketId) {
        return res.sendResponse(new MissingHeaderParam("socketId"));
    }

    const socket = io.sockets.sockets.get(socketId) as Socket;
    if (!socket) {
        return res.sendResponse(new SocketNotFound("Socket not found"));
    }

    req.socket = socket;

    return next();
};

export default getConnectedSocketMiddleware;