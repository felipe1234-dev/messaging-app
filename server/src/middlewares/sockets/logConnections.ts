import { SocketMiddleware } from "@typings";

const logConenctionsMiddleware: SocketMiddleware = (socket, next) => {
    console.log("Socket server connection received:");
    console.log("ID -", socket.id);
    console.log("Namespace -", socket.nsp.name);
    
    socket.use((event, next) => {
        console.log("Event -", event[0]);
        socket.event = event[0];
        next();
    });
    
    return next();
}

export default logConenctionsMiddleware;