import { RouteMiddleware } from "@typings";
import configs from "@configs";
import portscanner from "portscanner";

const startSocketServerMiddleware: RouteMiddleware = (req, res, next, io) => {
    portscanner.checkPortStatus(configs.socketPort, (error, status) => {
        if (!error && status === "closed") {
            io.listen(configs.socketPort);
            console.log("Socket server listening on port " + configs.socketPort);
        }

        return next();
    });
};

export default startSocketServerMiddleware;