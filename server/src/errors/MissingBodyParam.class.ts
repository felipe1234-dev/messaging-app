import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class MissingBodyParam extends ServerError {
    constructor(param: string, status = 400) {
        super(codes.BAD_REQUEST, `Missing "${param}" body param`, status);
    }
}

export default MissingBodyParam;
