import { generateUid, toDate } from "../functions";

const messageTypes = ["text", "audio", "video", "link"] as const;
type MessageType = (typeof messageTypes)[number];

const historyTypes = ["view", "edit"] as const;
type HistoryType = (typeof historyTypes)[number];

class Message {
    public uid: string;
    public type: MessageType;
    public chat: string;
    public sentBy: string;
    public repliedTo?: string;
    public deleted: boolean;
    public deletedAt?: Date;
    public deletedBy?: string;
    public createdAt: Date;
    public history: {
        type: HistoryType;
        user: string;
        extra: {
            [key: string]: any;
        };
        date: Date;
    }[];

    constructor(data: Partial<Message> = {}) {
        const {
            uid = generateUid("message-", 8 + 25),
            type = "text",
            chat = "",
            sentBy = "",
            repliedTo,
            deleted = false,
            deletedAt,
            deletedBy,
            createdAt = new Date(),
            history = [],
        } = data;

        this.uid = uid;
        this.type = type;
        this.chat = chat;
        this.sentBy = sentBy;

        if (repliedTo) this.repliedTo = repliedTo;

        this.deleted = deleted;
        if (deletedAt) this.deletedAt = toDate(deletedAt);
        if (deletedBy) this.deletedBy = deletedBy;

        this.createdAt = toDate(createdAt);
        this.history = history.map((item) => ({
            ...item,
            date: toDate(item.date),
        }));
    }

    public static isMessage(obj: any): obj is Message {
        return (
            obj instanceof Message ||
            (obj instanceof Object &&
                typeof obj.uid === "string" &&
                typeof obj.type === "string" &&
                messageTypes.includes(obj.type) &&
                typeof obj.chat === "string" &&
                typeof obj.sentBy === "string" &&
                (obj.repliedTo === undefined ||
                    typeof obj.repliedTo === "string") &&
                typeof obj.deleted === "boolean" &&
                (obj.deletedAt === undefined ||
                    toDate(obj.deletedAt) instanceof Date) &&
                (obj.deletedBy === undefined ||
                    typeof obj.deletedBy === "string") &&
                toDate(obj.createdAt) instanceof Date &&
                obj.history instanceof Array &&
                obj.history.every(
                    (item: any) =>
                        item instanceof Object &&
                        typeof item.type === "string" &&
                        historyTypes.includes(item.type) &&
                        typeof item.user === "string" &&
                        item.extra instanceof Date &&
                        typeof item.user === "string" &&
                        toDate(item.date) instanceof Date
                ))
        );
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

    public static isTextMessage(obj: any): obj is TextMessage {
        return (
            obj instanceof TextMessage ||
            (obj instanceof Object &&
                obj.type === "text" &&
                typeof obj.text === "string" &&
                Message.isMessage(obj))
        );
    }
}

class AudioMessage extends Message {
    public type: "audio";
    public audioURL: string;
    public audioDuration: number;
    public audioDurationUnit: "ms";

    constructor(data: Partial<AudioMessage> = {}) {
        const { audioURL = "", audioDuration = 0 } = data;

        super(data);

        this.type = "audio";
        this.audioURL = audioURL;
        this.audioDuration = audioDuration;
        this.audioDurationUnit = "ms";
    }

    public static isAudioMessage(obj: any): obj is AudioMessage {
        return (
            obj instanceof AudioMessage ||
            (obj instanceof Object &&
                obj.type === "audio" &&
                typeof obj.audioURL === "string" &&
                typeof obj.audioDuration === "number" &&
                obj.audioDurationUnit === "ms" &&
                Message.isMessage(obj))
        );
    }
}

class VideoMessage extends Message {
    public type: "video";
    public videoURL: string;
    public videoDuration: number;
    public videoDurationUnit: "ms";

    constructor(data: Partial<VideoMessage> = {}) {
        const { videoURL = "", videoDuration = 0 } = data;

        super(data);

        this.type = "video";
        this.videoURL = videoURL;
        this.videoDuration = videoDuration;
        this.videoDurationUnit = "ms";
    }

    public static isVideoMessage(obj: any): obj is VideoMessage {
        return (
            obj instanceof VideoMessage ||
            (obj instanceof Object &&
                obj.type === "video" &&
                typeof obj.videoURL === "string" &&
                typeof obj.videoDuration === "number" &&
                obj.videoDurationUnit === "ms" &&
                Message.isMessage(obj))
        );
    }
}

export default Message;

export { TextMessage, AudioMessage, VideoMessage };
  