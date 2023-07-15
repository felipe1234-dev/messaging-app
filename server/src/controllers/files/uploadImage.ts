import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { FileStorage } from "@services";
import { MissingFormDataParam, ServerError, Unauthenticated } from "@errors";

const uploadImageController: RouteController = async (
    req: {
        body: {
            image?: File;
            path?: string;
            metadata?: {
                [key: string]: any;
            };
        };
    } & Request,
    res
) => {
    try {
        console.log("req.body", JSON.stringify(req.body));

        const { image, path, metadata = {} } = req.body;

        if (!image) throw new MissingFormDataParam("image");
        if (!path) throw new MissingFormDataParam("path");

        const { user } = req;
        if (!user) throw new Unauthenticated("You're not authenticated");

        const url = await FileStorage.upload(image, path, metadata);

        res.sendResponse({
            status: 200,
            code: codes.FILE_SAVED,
            message: "File saved successfully",
            url,
        });
    } catch (err) {
        res.sendResponse(err as ServerError);
    }
};

export default uploadImageController;
