import { ResponseError } from "@types";
import { codes } from "messaging-app-globals";

function isResponseError(obj: any): obj is ResponseError {
    const possibleCodes = Object.values(codes);

    return (
        obj instanceof Object &&
        typeof obj.status === "number" &&
        typeof obj.message === "string" &&
        possibleCodes.includes(obj.code)
    );
}

export default isResponseError;
