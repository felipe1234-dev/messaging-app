import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class MissingURLParam extends ServerError {
    constructor(param: string, status = 400) {
        super(codes.BAD_REQUEST, `Missing "${param}" URL param`, status);
    }
}

export default MissingURLParam;
