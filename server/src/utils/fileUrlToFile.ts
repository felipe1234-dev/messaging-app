import { HTTPReq } from "@services";
import { generateUid } from "messaging-app-globals";

async function fileUrlToFile(url: string) {
    const uid = generateUid();
    const blob = await HTTPReq.get(url, { responseType: "blob" });
    const extension = blob.type.split("/").pop() || "";
    const filename = `${uid}.${extension}`;
    const file = new File([blob], filename, { type: blob.type });
    return file;
}

export default fileUrlToFile;