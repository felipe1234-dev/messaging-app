import * as socketIo from "socket.io";
import { 
    Request as ExpressRequest, 
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction
} from "express";
import {
    Request,
    Response,
    NextFunction,
    RouteController,
    SocketServer,
    Socket
} from "@typings";

const useRouteController = (
    controller: RouteController, 
    socket: socketIo.Socket,
    io: socketIo.Server
) => async (
    req: ExpressRequest, 
    res: ExpressResponse,
    next: ExpressNextFunction
) => {
    const request = req as Request;
    const response = res as Response;
    const nextFunc = next as NextFunction;
    const newSocket = socket as Socket;
    const socketServer = io as SocketServer;
    
    await controller(
        request, 
        response, 
        nextFunc, 
        newSocket,
        socketServer
    );
};

export default useRouteController;