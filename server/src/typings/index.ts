import { 
    Express,
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { User, codes } from "messaging-app-globals";
import * as socketIo from "socket.io";

export type Code = keyof typeof codes;

export type Operator = "<"
    | "<="
    | "=="
    | "!="
    | ">="
    | ">"
    | "array-contains"
    | "in"
    | "not-in"
    | "array-contains-any";

export interface Request extends ExpressRequest {
    headers: {
        [key: string]: string;
    };
    user: User;
    body: {
        [key: string]: any;
    };
    params: {
        [key: string]: string;
    };
    query: {
        [key: string]: string;
    }
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

export interface FilterParams {
    wheres?: Array<[field: string, operator: Operator, value: any]>;
    limit?: number;
    startAfter?: string;
}

export interface Socket extends socketIo.Socket {
    event: string;
}

export interface App extends Express {}

export interface SocketServer extends socketIo.Server {}

export type Router = (
    app: App,
    socket: socketIo.Socket,
    io: socketIo.Server
) => void;

export type RouteController = (
    req: Request,
    res: Response, 
    next: NextFunction,
    socket: Socket,
    io: SocketServer
) => Promise<void>;

export type SocketController = (
    input: any,
    socket: Socket,
    io: SocketServer
) => Promise<any>;

export type RouteMiddleware = (
    req: Request,
    res: Response, 
    next: NextFunction,
    io: SocketServer
) => Promise<void> | void;

export type SocketMiddleware = (
    socket: Socket,
    next: NextFunction,
    io: SocketServer
) => Promise<any> | void;