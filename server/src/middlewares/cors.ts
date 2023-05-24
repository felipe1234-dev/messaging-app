import cors from "cors";
import configs from "@configs";

const corsOptions = {
    origin: configs.allowedOrigins,
    optionsSuccessStatus: 200,
};

const corsMiddleware = () => cors(corsOptions);

export default corsMiddleware();
