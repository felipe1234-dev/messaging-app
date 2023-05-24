import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class SocketNotFound extends ServerError {
    constructor(message: string, status = 404) {
        super(codes.SOCKET_NOT_FOUND, message, status);
    }
}

export default SocketNotFound;
