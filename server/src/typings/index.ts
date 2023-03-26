import { 
    Express,
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { User, codes } from "messaging-app-globals";
import * as socketIo from "socket.io";

export interface Socket extends socketIo.Socket {
    event: string;
}

export interface App extends Express {}

export interface SocketServer extends socketIo.Server {}

export type Code = keyof typeof codes;

export interface Request extends Omit<ExpressRequest, "socket"> {
    headers: {
        authorization?: string;
        "socket-id"?: string;
        origin?: string;
    };
    user?: User;
    socket?: Socket;
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
    app: App,
    io: socketIo.Server
) => void;

export type SocketRouter = (
    app: App,
    socket: socketIo.Socket,
    io: socketIo.Server
) => void;

export type RouteController = (
    req: Request,
    res: Response, 
    next: NextFunction,
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