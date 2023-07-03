const codes = {
    SOCKET_NOT_FOUND: "SOCKET_NOT_FOUND" as const,
    BAD_REQUEST: "BAD_REQUEST" as const,
    UNAUTHORIZED: "UNAUTHORIZED" as const,
    UNAUTHENTICATED: "UNAUTHENTICATED" as const,
    FORBIDDEN: "FORBIDDEN" as const,
    NOT_FOUND: "NOT_FOUND" as const,
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR" as const,

    ADMIN_ADDED: "ADMIN_ADDED" as const,
    LOGGED_IN: "LOGGED_IN" as const,
    LOGGED_OUT: "LOGGED_OUT" as const,
    SESSION_RECOVERED: "SESSION_RECOVERED" as const,
    USER_FETCHED: "USER_FETCHED" as const,
    USERS_FETCHED: "USERS_FETCHED" as const,
    USER_CREATED: "USER_CREATED" as const,
    USER_BLOCKED: "USER_BLOCKED" as const,
    USER_UNBLOCKED: "USER_UNBLOCKED" as const,
    USER_UNDELETED: "USER_UNDELETED" as const,
    USER_DELETED: "USER_DELETED" as const,
    USER_UPDATED: "USER_UPDATED" as const,
    PASSWORD_RECOVERY_SENT: "PASSWORD_RECOVERY_SENT" as const,

    MESSAGE_SENT: "MESSAGE_SENT" as const,
    MESSAGES_FETCHED: "MESSAGES_FETCHED" as const,

    CHAT_CREATED: "CHAT_CREATED" as const,
    CHAT_DELETED: "CHAT_DELETED" as const,
    CHAT_UPDATED: "CHAT_UPDATED" as const,
    MEMBER_REMOVED: "MEMBER_REMOVED" as const,
    MEMBER_ADDED: "MEMBER_ADDED" as const,
    CHAT_FETCHED: "CHAT_FETCHED" as const,
    CHATS_FETCHED: "CHATS_FETCHED" as const,
    MEMBERS_FETCHED: "MEMBERS_FETCHED" as const,

    FRIENDS_FETCHED: "FRIENDS_FETCHED" as const,
    FRIEND_REQUEST_SENT: "FRIEND_REQUEST_SENT" as const,
};

export default codes;
