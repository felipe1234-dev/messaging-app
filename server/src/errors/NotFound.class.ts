import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class NotFound extends ServerError {
    constructor(message: string, status = 404) {
        super(codes.NOT_FOUND, message, status);
    }
}

export default NotFound;
