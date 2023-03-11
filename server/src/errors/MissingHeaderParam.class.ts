import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class MissingHeaderParam extends ServerError {
    constructor(param: string, status = 400) {
        super(codes.BAD_REQUEST, `Missing "${param}" header param`, status);
    }
}

export default MissingHeaderParam;