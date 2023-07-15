import ServerError from "./ServerError.class";
import { codes } from "messaging-app-globals";

class MissingFormDataParam extends ServerError {
    constructor(param: string, status = 400) {
        super(codes.BAD_REQUEST, `Missing "${param}" form field`, status);
    }
}

export default MissingFormDataParam;
