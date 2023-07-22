import { Request, RouteController } from "@typings";
import { codes, Media } from "messaging-app-globals";
import { FileStorage } from "@services";
import { MediaDB } from "@databases";
import { getFileExtension, getFileMimetype } from "@utils";
import {
    InvalidParam,
    MissingBodyParam,
    ServerError,
    Unauthenticated,
} from "@errors";

const uploadImageController: RouteController = async (
    req: {
        body: {
            filename?: string;
            buffer?: number[];
            path?: string;
            metadata?: {
                [key: string]: any;
            };
        };
    } & Request,
    res
) => {
    try {
        const { filename, buffer: bufferArr, path, metadata = {} } = req.body;

        if (!filename) throw new MissingBodyParam("filename");
        if (!path) throw new MissingBodyParam("path");
        if (!bufferArr) throw new MissingBodyParam("buffer");
        if (!(bufferArr instanceof Array))
            throw new InvalidParam("Buffer must be an array of numbers");

        const { user } = req;
        if (!user) throw new Unauthenticated("You're not authenticated");

        const mediaDB = new MediaDB();

        const mimetype = getFileMimetype(filename);
        const extension = getFileExtension(filename);
        const size = bufferArr.length;
        const buffer = Buffer.from(bufferArr);

        const newMetadata = {
            ...metadata,
            filename,
            mimetype,
            extension,
            size,
        };

        const url = await FileStorage.upload(buffer, path, newMetadata);

        const newMedia = new Media({
            filename,
            mimetype,
            extension,
            size,
            metadata: newMetadata,
            path,
            url,
            createdBy: user.uid,
        });

        await mediaDB.doc(newMedia.uid).create(newMedia);

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
