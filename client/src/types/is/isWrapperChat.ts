import { WrapperChat } from "@types";
import { Chat, User, Message } from "messaging-app-globals";

function isWrapperChat(obj: any): obj is WrapperChat {
    const {
        members,
        blocked,
        admins,
        createdBy,
        messages,
        getNewestMessage,
        getOldestMessage,
        loadMoreMessages,
        ...chatData
    } = obj;

    return (
        Chat.isChat(new Chat(chatData)) &&
        members instanceof Array &&
        members.every((item: any) => User.isUser(item)) &&
        blocked instanceof Array &&
        blocked.every((item: any) => User.isUser(item)) &&
        admins instanceof Array &&
        admins.every((item: any) => User.isUser(item)) &&
        User.isUser(createdBy) &&
        messages instanceof Array &&
        messages.every((item: any) => Message.isMessage(item)) &&
        typeof getNewestMessage === "function" &&
        typeof getOldestMessage === "function" &&
        typeof loadMoreMessages === "function"
    );
}

export default isWrapperChat;
