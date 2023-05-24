import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class Unauthorized extends ServerError {
    constructor(message: string, status = 403) {
        super(codes.UNAUTHORIZED, message, status);
    }
}

export default Unauthorized;
