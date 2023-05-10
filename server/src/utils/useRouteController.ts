import { 
    Request as ExpressRequest, 
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction
} from "express";
import {
    Request,
    Response,
    NextFunction,
    RouteController
} from "@typings";

const useRouteController = (
    controller: RouteController
) => async (
    req: ExpressRequest, 
    res: ExpressResponse,
    next: ExpressNextFunction
) => {
    // @ts-ignore
    const request = req as Request;
    const response = res as Response;
    const nextFunc = next as NextFunction;
    
    await controller(
        request, 
        response, 
        nextFunc
    );
};

export default useRouteController;