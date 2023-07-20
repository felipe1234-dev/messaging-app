import { RouteMiddleware /*, File*/ } from "@typings";
import { codes } from "messaging-app-globals";
import { ServerError } from "@errors";
//import { getFileExtension } from "@utils";
import fs from "fs";

const formDataParserMiddleware: RouteMiddleware = async (req, res, next) => {
    try {
        const contentType = req.headers["content-type"];

        if (!contentType.includes("multipart/form-data")) return next();

        const boundary = contentType.split("boundary=")[1];
        const formBuffer = req.body as Buffer;
        const chunkString = Buffer.from(formBuffer).toString();

        fs.writeFileSync("chunkString.txt", chunkString);

        let loadedBytes = 0;
        const totalBytes = chunkString.length;
        let progress = 0;

        console.log("");
        console.log("Processing multipart/form-data...");
        console.log("Boundary:", boundary);
        console.log("Size:", totalBytes, "byte(s)");
        console.log("");

        const logProgress = () => {
            const progressNow = Math.round((loadedBytes / totalBytes) * 100);
            if (progressNow === progress) return;
            progress = progressNow;

            const amountOfSticks = Math.round(
                Math.min(100, Math.ceil(progress)) / 2
            );
            const amountOfSpaces = Math.max(0, 50 - amountOfSticks);

            console.log(
                `🛠️  Progress: [${"|".repeat(amountOfSticks)}${" ".repeat(
                    amountOfSpaces
                )}] ${progress}% - (${loadedBytes}/${totalBytes} byte(s) loaded)`
            );
        };

        //const body: { [field: string]: any } = {};

        logProgress();

        const fields = chunkString
            .split(boundary)
            .map((str) =>
                str
                    .replace(/^--/, "")
                    .replace(/--$/, "")
                    .replace(/(\r\n|\r|\n)/g, "\n")
            )
            .filter((str) => !!str.trim());

        for (let [, field] of Object.entries(fields)) {
            const headers = field.split(/\n\n/)[0];
            const body = field.replace(headers, "");

            if (!headers) continue;

            let contentDisposition = "";
            let contentType = "";

            const lines = headers.split(/\n/);

            for (const line of lines) {
                if (line.includes("Content-Disposition")) {
                    contentDisposition = line.replace(
                        "Content-Disposition:",
                        ""
                    );
                } else if (line.includes("Content-Type")) {
                    contentType = line.replace("Content-Type:", "");
                }
            }

            let fieldname = "";
            let filename = "";
            let mimetype = "";

            if (contentDisposition) {
                const nameMatch = field.match(/name="([^"]+)"/);
                const filenameMatch = field.match(/filename="([^"]+)"/);

                if (nameMatch) {
                    fieldname = nameMatch[1];
                }

                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            if (contentType) {
                mimetype = contentType.trim();
            }

            console.log("fieldname", fieldname);
            console.log("filename", filename);
            console.log("mimetype", mimetype);

            const isFile = !!filename;

            if (isFile) {
                fs.writeFileSync(filename, Buffer.from(body.trim()));
            }
        }

        /*    const lines = fieldStr.split(/[\n\r]/);

            let fieldName = "";
            let isFile = false;
            let filename = "";
            let mimetype = "";
            let fileBufferStr = "";
            let value = "";

            for (let line of lines) {
                loadedBytes += line.length;

                logProgress();

                line = line.replace(/^--/, "");
                line = line.replace(/--$/, "");
                line = line.replace(/[\n\r]/g, "");

                if (line.includes("Content-Disposition")) {
                    if (line.includes("name=")) {
                        fieldName = line
                            .trim()
                            .replace(/^.*\bname="([^"]*)".*$/, "$1");
                    }

                    if (line.includes("filename")) {
                        isFile = true;
                        filename = line
                            .trim()
                            .replace(/^.*\bfilename="([^"]*)".*$/, "$1");
                    }
                } else if (line.includes("Content-Type")) {
                    isFile = true;
                    mimetype = line.trim().split("Content-Type:")[1].trim();
                } else {
                    if (isFile) {
                        fileBufferStr += ;
                    } else {
                        value += line;
                    }
                }
            }

            if (!fieldName) continue;

            if (isFile) {
                fs.writeFileSync("fileBufferStr.txt", fileBufferStr);

                const fileBuffer = Buffer.from(fileBufferStr);
                const file: File = {
                    filename,
                    mimetype,
                    extension: getFileExtension(filename),
                    size: Buffer.byteLength(fileBuffer),
                    buffer: fileBuffer,
                };

                console.log("");
                console.log("✔️ File loaded!");
                console.log(" 🔹 Filename:", file.filename);
                console.log(" 🔹 Mimetype:", file.mimetype);
                console.log(" 🔹 Extension:", file.extension);
                console.log(" 🔹 Size:", file.size, "byte(s)");
                console.log("");

                body[fieldName] = file;
            } else {
                value = value.trim();
                console.log("");
                console.log("✔️ Form field loaded!");
                console.log(" 🔹 Name:", fieldName);
                console.log(" 🔹 Value:", value);
                console.log("");
                body[fieldName] = value;
            }
        }*/

        logProgress();

        //req.body = body;

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
