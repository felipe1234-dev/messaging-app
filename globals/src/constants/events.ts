const events = {
    USER_UPDATED: "userUpdated" as const,
    FRIEND_UPDATED: "friendUpdated" as const,
    FRIEND_REQUEST_SENT: "friendRequestSent" as const,
    CHAT_UPDATED: "chatUpdated" as const,
    MESSAGE_SENT: "messageSent" as const
};

export default events;