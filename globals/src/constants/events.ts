const events = {
    USER_UPDATED: "userUpdated" as const,
    FRIEND_UPDATED: "friendUpdated" as const,
    FRIEND_REQUEST_SENT: "friendRequestSent" as const,
    CHAT_UPDATED: "chatUpdated" as const,
    MESSAGE_SENT: "messageSent" as const,
    TEXT_MESSAGE_SENT: "textMessageSent" as const,
    VIDEO_MESSAGE_SENT: "videoMessageSent" as const,
    AUDIO_MESSAGE_SENT: "audioMessageSent" as const,
};

export default events;
