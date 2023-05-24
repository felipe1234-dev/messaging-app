import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class MissingPostParam extends ServerError {
    constructor(param: string, status = 400) {
        super(codes.BAD_REQUEST, `Missing "${param}" post param`, status);
    }
}

export default MissingPostParam;
