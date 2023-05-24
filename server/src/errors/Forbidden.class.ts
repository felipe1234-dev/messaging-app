import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class Forbidden extends ServerError {
    constructor(message: string, status = 403) {
        super(codes.FORBIDDEN, message, status);
    }
}

export default Forbidden;
