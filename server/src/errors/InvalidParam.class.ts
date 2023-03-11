import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class InvalidParam extends ServerError {
    constructor(message: string, status = 400) {
        super(codes.BAD_REQUEST, message, status);
    }
}

export default InvalidParam;