import { generateUid, toDate } from "../functions";

const messageTypes = ["text", "audio", "video", "link"] as const;
export type MessageType = (typeof messageTypes)[number];

const historyTypes = ["view", "edit"] as const;
export type HistoryType = (typeof historyTypes)[number];

const durationUnits = ["ms", "s", "m", "h"] as const;
export type DurationUnit = (typeof durationUnits)[number];

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

    public wasViewedBy(userUid: string) {
        return !!this.history.find((item) => item.user === userUid);
    }

    public clone() {
        return new Message({ ...this });
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
                (obj.history === undefined ||
                    (obj.history instanceof Array &&
                        obj.history.every(
                            (item: any) =>
                                item instanceof Object &&
                                typeof item.type === "string" &&
                                historyTypes.includes(item.type) &&
                                typeof item.user === "string" &&
                                item.extra instanceof Object &&
                                toDate(item.date) instanceof Date
                        ))))
        );
    }
}

class TextMessage extends Message {
    public type: "text";
    public text: string;
    public attachments?: {
        filename: string;
        extension: string;
        mimetype: string;
        size: number;
        path: string;
        url: string;
    }[];

    constructor(data: Partial<TextMessage> = {}) {
        super(data);

        const { text = "", attachments = [] } = data;
        
        this.type = "text";
        this.text = text;
        this.attachments = attachments;
    }

    public override clone() {
        return new TextMessage({ ...this });
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
    public audio: {
        url: string;
        duration: number;
        unit: DurationUnit;
    };

    constructor(data: Partial<AudioMessage> = {}) {
        const {
            audio = {
                url: "",
                duration: 0,
                unit: "ms",
            },
        } = data;

        super(data);

        this.type = "audio";
        this.audio = audio;
    }

    public override clone() {
        return new AudioMessage({ ...this });
    }

    public static isAudioMessage(obj: any): obj is AudioMessage {
        return (
            obj instanceof AudioMessage ||
            (obj instanceof Object &&
                obj.type === "audio" &&
                obj.audio instanceof Object &&
                typeof obj.audio.url === "string" &&
                typeof obj.audio.duration === "number" &&
                durationUnits.includes(obj.audio.unit) &&
                Message.isMessage(obj))
        );
    }
}

class VideoMessage extends Message {
    public type: "video";
    public video: {
        url: string;
        duration: number;
        unit: DurationUnit;
    };

    constructor(data: Partial<VideoMessage> = {}) {
        const {
            video = {
                url: "",
                duration: 0,
                unit: "ms",
            },
        } = data;

        super(data);

        this.type = "video";
        this.video = video;
    }

    public override clone() {
        return new VideoMessage({ ...this });
    }

    public static isVideoMessage(obj: any): obj is VideoMessage {
        return (
            obj instanceof VideoMessage ||
            (obj instanceof Object &&
                obj.type === "video" &&
                obj.video instanceof Object &&
                typeof obj.video.url === "string" &&
                typeof obj.video.duration === "number" &&
                durationUnits.includes(obj.video.unit) &&
                Message.isMessage(obj))
        );
    }
}

export default Message;

export { TextMessage, AudioMessage, VideoMessage };
