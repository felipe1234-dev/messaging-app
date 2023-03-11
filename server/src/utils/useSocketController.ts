import * as socketIo from "socket.io";
import { SocketController, Socket, SocketServer } from "@typings";

const useSocketController = (
    controller: SocketController,
    socket: socketIo.Socket,
    io: socketIo.Server
) => async (input: any) => {
    const newSocket = socket as Socket;
    const newIo = io as SocketServer;

    const output = await controller(input, newSocket, newIo);
    return output;
};

export default useSocketController;