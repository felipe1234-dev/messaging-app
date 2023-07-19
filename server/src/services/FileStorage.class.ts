import { bucket } from "@databases";
import { File } from "@typings";
import { generateUid } from "messaging-app-globals";

import fs from "fs";
import os from "os";

class FileStorage {
    static async upload(
        file: File,
        destination: string,
        metadata?: any
    ): Promise<string> {
        const localPath = FileStorage.saveLocally(file);

        try {
            await bucket.upload(localPath, {
                destination,
                resumable: true,
                public: true,
                metadata: {
                    filename: file.filename,
                    mime: file.mimetype,
                    extension: file.extension,
                    lastModified: new Date(),
                    size: file.size,
                    ...metadata,
                },
            });

            fs.unlinkSync(localPath);

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

    static saveLocally(file: File) {
        const localPath = `${os.tmpdir}/${generateUid()}.${file.extension}`;
        const buffer = file.buffer;

        fs.writeFileSync(localPath, buffer);

        return localPath;
    }
}

export default FileStorage;
