import { HTTPReq } from "@services";
import { File } from "@typings";
import { generateUid } from "messaging-app-globals";
import getFileExtension from "./getFileExtension";

async function fileUrlToFile(url: string): Promise<File> {
    const uid = generateUid();
    const blob = await HTTPReq.get(url, { responseType: "blob" });
    const extension = blob.type.split("/").pop() || "";
    const filename = `${uid}.${extension}`;
    const file = new File([blob], filename, { type: blob.type });
    return {
        filename: file.name,
        mimetype: file.type,
        extension: getFileExtension(file.name),
        size: file.size,
        buffer: Buffer.from(await file.arrayBuffer()),
    };
}

export default fileUrlToFile;
