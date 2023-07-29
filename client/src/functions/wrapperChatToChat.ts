import { WrapperChat } from "@types";
import { Chat } from "messaging-app-globals";

function wrapperChatToChat(wrapperChat: WrapperChat): Chat {
    return new Chat({
        ...wrapperChat,
        members: wrapperChat.members.map((user) => user.uid),
        blocked: wrapperChat.blocked.map((user) => user.uid),
        admins: wrapperChat.admins.map((user) => user.uid),
        createdBy: wrapperChat.createdBy.uid,
    });
}

export default wrapperChatToChat;
