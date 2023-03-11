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
    SocketServer
} from "@typings";

const useRouteController = (
    controller: RouteController,
    io: socketIo.Server
) => async (
    req: ExpressRequest, 
    res: ExpressResponse,
    next: ExpressNextFunction
) => {
    // @ts-ignore
    const request = req as Request;
    const response = res as Response;
    const nextFunc = next as NextFunction;
    const socketServer = io as SocketServer;
    
    await controller(
        request, 
        response, 
        nextFunc,
        socketServer
    );
};

export default useRouteController;