import * as socketIo from "socket.io";

import {
    NextFunction,
    SocketMiddleware,
    SocketServer,
    Socket
} from "@typings";

const useSocketMiddleware = (
    middleware: SocketMiddleware,
    io: socketIo.Server
) => async (
    socket: socketIo.Socket,
    next: NextFunction
) => {
    await middleware(
        socket as Socket,
        next,
        io as SocketServer
    );
};

export default useSocketMiddleware;