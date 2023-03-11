import { Request, RouteController } from "@typings";
import { codes } from "messaging-app-globals";
import { 
    InvalidParam, 
    MissingPostParam, 
    MissingURLParam, 
    NotFound, 
    ServerError, 
    Unauthorized 
} from "@errors";
import { TextMessage, User, VideoMessage } from "messaging-app-globals";
import { MessagesDB, ChatsDB } from "@databases";
import { FileStorage } from "@services";
import { fileUrlToFile, getVideoDuration } from "@utils";

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

    if (!text) throw new MissingPostParam("text");
        
    const textMessage = new TextMessage({
        text,
        sentBy: user.uid,
        chat
    });

    await MessagesDB.createMessage(textMessage);
}

async function createVideoMessage(params: VideoMessageBody & { user: User }) {
    const { videoURL, chat, user } = params;

    if (!videoURL) throw new MissingPostParam("videoURL");
    
    const file = await fileUrlToFile(videoURL);
    const newVideoURL = await FileStorage.upload(file, file.name, { type: file.type });
    const videoDuration = await getVideoDuration(videoURL);

    const videoMessage = new VideoMessage({
        videoURL: newVideoURL,
        chat,
        videoDuration,
        sentBy: user.uid
    });

    await MessagesDB.createMessage(videoMessage);
}

const sendMessageController: RouteController = async (
    req: Request & {
        params: {
            type?: "text" | "video" | "audio"
        };
        body: Partial<TextMessageBody | VideoMessageBody>
    },
    res
) => {
    try {
        const { type } = req.params;
        
        if (!type) throw new MissingURLParam("type");

        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");
        
        const { chat: chatUid } = req.body;

        if (!chatUid) throw new MissingPostParam("chat");
        
        const chat = await ChatsDB.getChatByUid(chatUid);
        
        if (!chat) throw new NotFound("Chat not found");
        if (!chat.members.includes(currentUser.uid)) throw new Unauthorized("You don't participate in this chat");
        if (chat.blocked.includes(currentUser.uid)) throw new Unauthorized("You were blocked");

        switch (type) {
            case "text":
                const { text } = req.body;
                await createTextMessage({ text, chat: chatUid, user: currentUser });
                break;
            case "video":
                const { videoURL } = req.body;
                await createVideoMessage({ videoURL, chat: chatUid, user: currentUser });
                break;
            default:
                throw new InvalidParam("Invalid message type");
        }

        return res.sendResponse({
            status: 200,
            code: codes.MESSAGE_SENT,
            message: "Message sent successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default sendMessageController;