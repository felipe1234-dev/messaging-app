import { RouteMiddleware } from "@typings";
import { codes } from "messaging-app-globals";

const responseFormatterMiddleware: RouteMiddleware = (req, res, next) => {
    res.sendResponse = (data) => {
        if (data instanceof Error) {
            console.log("Error", data);

            return res.status(data.status || 500).send({
                ...data,
                success: false,
                status: data.status || 500,
                code: data.code || codes.INTERNAL_SERVER_ERROR,
                message: data.message || "Unknown error",
            });
        }

        return res.status(data.status).send({
            ...data,
            success: true,
            status: data.status,
            code: data.code,
            message: data.message,
        });
    };

    next();
};

export default responseFormatterMiddleware;
