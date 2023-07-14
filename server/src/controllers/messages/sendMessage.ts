import { fileUrlToFile, getVideoDuration } from "@utils";
import { Request, RouteController } from "@typings";
import { FileStorage } from "@services";
import { MessagesDB, ChatsDB } from "@databases";
import { codes, User, TextMessage, VideoMessage } from "messaging-app-globals";
import {
    InvalidParam,
    MissingBodyParam,
    MissingURLParam,
    NotFound,
    ServerError,
    Unauthorized,
} from "@errors";

interface TextMessageBody {
    text: string;
    chat: string;
}

interface VideoMessageBody {
    videoURL: string;
    chat: string;
}

async function createTextMessage(params: TextMessageBody & { user: User }) {
    const { text, chat, user } = params;

    if (!text) throw new MissingBodyParam("text");

    const textMessage = new TextMessage({
        text,
        sentBy: user.uid,
        chat,
    });

    await new MessagesDB().uid(textMessage.uid).create(textMessage);
}

async function createVideoMessage(params: VideoMessageBody & { user: User }) {
    const { videoURL, chat, user } = params;

    if (!videoURL) throw new MissingBodyParam("videoURL");

    const file = await fileUrlToFile(videoURL);
    const newVideoURL = await FileStorage.upload(file, file.name, {
        type: file.type,
    });
    const videoDuration = await getVideoDuration(videoURL);

    const videoMessage = new VideoMessage({
        videoURL: newVideoURL,
        chat,
        videoDuration,
        sentBy: user.uid,
    });

    await new MessagesDB().uid(videoMessage.uid).create(videoMessage);
}

const sendMessageController: RouteController = async (
    req: Request & {
        params: {
            type?: "text" | "video" | "audio";
        };
        body: Partial<TextMessageBody | VideoMessageBody>;
    },
    res
) => {
    try {
        const { type } = req.params;
        if (!type) throw new MissingURLParam("type");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");

        const { chat: chatUid } = req.body;
        if (!chatUid) throw new MissingBodyParam("chat");

        const chatsDB = new ChatsDB();

        const chat = await chatsDB.getByUid(chatUid);

        if (!chat) throw new NotFound("Chat not found");
        if (!chat.members.includes(currentUser.uid))
            throw new Unauthorized("You don't participate in this chat");
        if (chat.blocked.includes(currentUser.uid))
            throw new Unauthorized("You were blocked");

        switch (type) {
            case "text":
                const { text } = req.body;
                await createTextMessage({
                    text,
                    chat: chatUid,
                    user: currentUser,
                });
                break;
            case "video":
                const { videoURL } = req.body;
                await createVideoMessage({
                    videoURL,
                    chat: chatUid,
                    user: currentUser,
                });
                break;
            default:
                throw new InvalidParam("Invalid message type");
        }

        return res.sendResponse({
            status: 200,
            code: codes.MESSAGE_SENT,
            message: "Message sent successfully",
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default sendMessageController;
