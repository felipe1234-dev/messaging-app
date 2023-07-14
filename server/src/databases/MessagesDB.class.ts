import DBAccess from "@services/DBAccess.class";
import {
    Message,
    TextMessage,
    AudioMessage,
    VideoMessage,
} from "messaging-app-globals";

class MessagesDB extends DBAccess<Message> {
    constructor() {
        super("messages");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => {
            if (TextMessage.isTextMessage(data)) return new TextMessage(data);
            if (AudioMessage.isAudioMessage(data))
                return new AudioMessage(data);
            if (VideoMessage.isVideoMessage(data))
                return new VideoMessage(data);
            return new Message(data);
        });
    }
}

export default MessagesDB;
