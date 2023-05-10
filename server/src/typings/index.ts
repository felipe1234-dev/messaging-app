import { 
    Express,
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { User, codes } from "messaging-app-globals";

export interface App extends Express {}

export type Code = keyof typeof codes;

export interface Request extends Omit<ExpressRequest, "socket"> {
    headers: {
        authorization?: string;
        origin?: string;
    };
    user?: User;
    body: {
        [key: string]: any;
    };
    params: {
        [key: string]: string;
    };
    query: {
        [key: string]: string;
    };
}

export type NextFunction = (error?: Error) => void;

export interface ResponseData {
    status: number;
    code: string;
    message: string;
    [key: string]: any;
}

export interface Response extends ExpressResponse {
    sendResponse(data: ResponseData): void;
}

export type ResponseType =
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";

export type HTTPRouter = (
    app: App
) => void;

export type RouteController = (
    req: Request,
    res: Response, 
    next: NextFunction,
) => Promise<void>;

export type RouteMiddleware = (
    req: Request,
    res: Response, 
    next: NextFunction
) => Promise<void> | void;