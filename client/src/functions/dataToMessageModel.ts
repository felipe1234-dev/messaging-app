import {
    Message,
    TextMessage,
    VideoMessage,
    AudioMessage,
} from "messaging-app-globals";

function dataToMessageModel(
    data: any
): Message | TextMessage | VideoMessage | AudioMessage {
    if (TextMessage.isTextMessage(data)) {
        return new TextMessage(data);
    } else if (AudioMessage.isAudioMessage(data)) {
        return new AudioMessage(data);
    } else if (VideoMessage.isVideoMessage(data)) {
        return new VideoMessage(data);
    } else {
        return new Message(data);
    }
}

export default dataToMessageModel;
