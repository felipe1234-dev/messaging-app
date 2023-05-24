import { RouteMiddleware } from "@typings";

const logRequestsMiddleware: RouteMiddleware = (req, res, next) => {
    console.log(
        "New request to",
        req.originalUrl,
        "at",
        new Date(),
        "from",
        req.headers.origin
    );
    return next();
};

export default logRequestsMiddleware;
