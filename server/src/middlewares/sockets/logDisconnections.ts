import { SocketMiddleware } from "@typings";

const logDisconenctionsMiddleware: SocketMiddleware = (socket, next) => {
    socket.on("disconnect", () => {
        console.log("Socket server disconnected:");
        console.log("ID -", socket.id);
        console.log("Namespace -", socket.nsp.name);
    });

    return next();
}

export default logDisconenctionsMiddleware;