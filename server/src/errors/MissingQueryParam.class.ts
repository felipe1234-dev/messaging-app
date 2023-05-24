import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class MissingQueryParam extends ServerError {
    constructor(param: string, status = 400) {
        super(codes.BAD_REQUEST, `Missing "${param}" query param`, status);
    }
}

export default MissingQueryParam;
