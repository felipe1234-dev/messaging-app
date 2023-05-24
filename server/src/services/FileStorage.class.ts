import { bucket } from "@databases";
import { fileToBuffer } from "@utils";
import { generateUid } from "messaging-app-globals";
import * as fs from "fs";

class FileStorage {
    static async upload(
        file: File,
        destination: string,
        metadata?: any
    ): Promise<string> {
        const extension = file.name.split(".").at(-1);
        const localPath = await FileStorage.saveLocally(file);

        try {
            await bucket.upload(localPath, {
                destination,
                resumable: true,
                public: true,
                metadata: {
                    filename: file.name,
                    mime: file.type,
                    extension,
                    lastModified: file.lastModified,
                    size: file.size,
                    ...metadata,
                },
            });

            const url = FileStorage.getURL(destination);
            return url;
        } catch (error) {
            const fileExists = fs.existsSync(localPath);
            if (fileExists) fs.unlinkSync(localPath);

            throw error;
        }
    }

    static getURL(filePath: string): string {
        const file = bucket.file(filePath);
        const url = file.publicUrl();
        return url;
    }

    static async saveLocally(file: File) {
        const extension = file.name.split(".").at(-1);
        const localPath = `./${generateUid()}.${extension}`;
        const buffer = await fileToBuffer(file);

        fs.writeFileSync(localPath, buffer);

        return localPath;
    }
}

export default FileStorage;
