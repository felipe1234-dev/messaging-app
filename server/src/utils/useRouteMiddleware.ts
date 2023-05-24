import {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction,
} from "express";
import { Request, Response, NextFunction, RouteMiddleware } from "@typings";

const useRouteMiddleware =
    (middleware: RouteMiddleware) =>
    async (
        req: ExpressRequest,
        res: ExpressResponse,
        next: ExpressNextFunction
    ) => {
        // @ts-ignore
        const request = req as Request;
        const response = res as Response;
        const nextFunc = next as NextFunction;

        await middleware(request, response, nextFunc);
    };

export default useRouteMiddleware;
