import { Request, RouteMiddleware, File } from "@typings";
import { codes } from "messaging-app-globals";
import { ServerError } from "@errors";
import formidable from "formidable";

const convertReqToFormData = async (
    req: Request
): Promise<
    [
        fields: { [key: string]: string | string[] },
        files: { [key: string]: File | File[] },
    ]
> => {
    const form = new formidable.IncomingForm();

    form.on("progress", (loaded, total) => {
        console.log(
            `Progress: ${Math.round(
                (loaded / total) * 100
            )}% (${loaded}/${total} bytes loaded)`
        );
    });

    return new Promise((resolve, reject) =>
        form.parse(
            // @ts-ignore
            req,
            (err, fields, files) => {
                if (err) return reject(err);
                resolve([fields, files]);
            }
        )
    );
};

const formDataParserMiddleware: RouteMiddleware = async (req, res, next) => {
    try {
        const [fields, files] = await convertReqToFormData(req);

        console.log("fields", fields);
        console.log("files", files);

        for (const [key, value] of Object.entries(fields)) {
            req.body[key] = value;
        }

        for (const [key, value] of Object.entries(files)) {
            req.body[key] = value;
        }

        next();
    } catch (error) {
        return res.sendResponse(
            new ServerError(
                codes.INTERNAL_SERVER_ERROR,
                (error as Error).message,
                500
            )
        );
    }
};

export default formDataParserMiddleware;
