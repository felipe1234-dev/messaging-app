import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class Unauthenticated extends ServerError {
    constructor(message: string, status = 401) {
        super(codes.UNAUTHENTICATED, message, status);
    }
}

export default Unauthenticated;
