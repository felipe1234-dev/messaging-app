import { path as ffmpegPath } from "ffprobe-static";
import * as ffprobe from "fluent-ffmpeg";
import { FileStorage } from "@services";
import fileUrlToFile from "./fileUrlToFile";
ffprobe.setFfprobePath(ffmpegPath);

/** Returns the video duration in milliseconds */
async function getVideoDuration(videoURL: string): Promise<number> {
    const file = await fileUrlToFile(videoURL);
    const filePath = await FileStorage.saveLocally(file);

    return new Promise((resolve, reject) => {
        ffprobe.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const duration = metadata.format.duration;
                resolve((duration || 0) * 1000);
            }
        });
    });
}

export default getVideoDuration;
