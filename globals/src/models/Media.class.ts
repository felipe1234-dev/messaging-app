import { generateUid, toDate } from "../functions";

class Media {
    public uid: string;
    public ref: string;
    public filename: string;
    public extension: string;
    public mimetype: string;
    public size: number;
    public path: string;
    public url: string;
    public metadata?: {
        [key: string]: any;
    };
    public deleted: boolean;
    public deletedAt?: Date;
    public deletedBy?: string;
    public createdAt: Date;
    public createdBy: string;

    constructor(data: Partial<Media> = {}) {
        const {
            uid = generateUid("media-", 6 + 25),
            ref = "",
            filename = "",
            extension = "",
            mimetype = "",
            size = 0,
            path = "",
            url = "",
            metadata = {},
            deleted = false,
            deletedAt,
            deletedBy,
            createdAt = new Date(),
            createdBy = "",
        } = data;

        this.uid = uid;
        this.ref = ref;
        this.filename = filename;
        this.extension = extension;
        this.mimetype = mimetype;
        this.size = size;
        this.path = path;
        this.url = url;
        this.metadata = metadata;

        this.deleted = deleted;
        if (deletedAt) this.deletedAt = toDate(deletedAt);
        if (deletedBy) this.deletedBy = deletedBy;

        this.createdAt = toDate(createdAt);
        this.createdBy = createdBy;
    }

    public static isMedia(obj: any): obj is Media {
        return (
            obj instanceof Media ||
            (obj instanceof Object &&
                typeof obj.uid === "string" &&
                typeof obj.ref === "string" &&
                typeof obj.filename === "string" &&
                typeof obj.extension === "string" &&
                typeof obj.mimetype === "string" &&
                typeof obj.size === "number" &&
                typeof obj.path === "string" &&
                (obj.metadata === undefined ||
                    obj.matadata instanceof Object) &&
                typeof obj.deleted === "boolean" &&
                (obj.deletedAt === undefined ||
                    toDate(obj.deletedAt) instanceof Date) &&
                (obj.deletedBy === undefined ||
                    typeof obj.deletedBy === "string") &&
                toDate(obj.createdAt) instanceof Date &&
                typeof obj.createdBy === "string")
        );
    }
}

export default Media;
