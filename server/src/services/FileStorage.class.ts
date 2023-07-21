import { bucket } from "@databases";
import { generateUid } from "messaging-app-globals";

import fs from "fs";
import os from "os";

class FileStorage {
    static async upload(
        buffer: Buffer,
        destination: string,
        metadata?: any
    ): Promise<string> {
        const localPath = FileStorage.saveLocally(buffer);

        try {
            await bucket.upload(localPath, {
                destination,
                resumable: true,
                public: true,
                metadata: {
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

    static saveLocally(buffer: Buffer) {
        const localPath = `${os.tmpdir}/${generateUid()}.png`;
        fs.writeFileSync(localPath, buffer);
        return localPath;
    }
}

export default FileStorage;
