import { generateUid, toDate } from "../functions";

class Message {
    public uid: string;
    public type: "text" | "audio" | "video" | "link";
    public chat: string;
    public sentBy: string;
    public deleted: boolean;
    public deletedAt?: Date;
    public deletedBy?: string;
    public createdAt: Date;
    public views: {
        viewedBy: string;
        viewedAt: Date;
    }[];

    constructor(data: Partial<Message> = {}) {
        const {
            uid = generateUid("message-", 8 + 25),
            type = "text",
            chat = "",
            sentBy = "",
            deleted = false,
            deletedAt,
            deletedBy,
            createdAt = new Date(),
            views = []
        } = data;

        this.uid = uid;
        this.type = type;
        this.chat = chat;
        this.sentBy = sentBy;

        this.deleted = deleted;
        if (deletedAt) this.deletedAt = toDate(deletedAt);
        if (deletedBy) this.deletedBy = deletedBy;
        
        this.createdAt = toDate(createdAt);
        this.views = views.map(view => ({
            ...view,
            viewedAt: toDate(view.viewedAt)
        }));
    }
}

class TextMessage extends Message {
    public type: "text";
    public text: string;

    constructor(data: Partial<TextMessage> = {}) {
        super(data);

        const { text = "" } = data;
        this.type = "text";
        this.text = text;
    }
}

class AudioMessage extends Message {
    public type: "audio";
    public audioURL: string;
    public audioDuration: number;
    public audioDurationUnit: "ms";

    constructor(data: Partial<AudioMessage> = {}) {
        const {
            audioURL = "",
            audioDuration = 0
        } = data;

        super(data);

        this.type = "audio";
        this.audioURL = audioURL;
        this.audioDuration = audioDuration;
        this.audioDurationUnit = "ms";
    }
}

class VideoMessage extends Message {
    public type: "video";
    public videoURL: string;
    public videoDuration: number;
    public videoDurationUnit: "ms";

    constructor(data: Partial<VideoMessage> = {}) {
        const {
            videoURL = "",
            videoDuration = 0
        } = data;

        super(data);

        this.type = "video";
        this.videoURL = videoURL;
        this.videoDuration = videoDuration;
        this.videoDurationUnit = "ms";
    }
}

export default Message;

export {
    TextMessage, 
    AudioMessage, 
    VideoMessage
};