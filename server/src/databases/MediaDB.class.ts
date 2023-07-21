import DBAccess from "@services/DBAccess.class";
import { Media } from "messaging-app-globals";

class MediaDB extends DBAccess<Media> {
    constructor() {
        super("media");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => new Media(data));
    }
}

export default MediaDB;
