import { isLocal } from "@functions";
import { 
    events,
    FilterParams, 
    User, 
    Chat, 
    Message,
    TextMessage, 
    AudioMessage, 
    VideoMessage
} from "messaging-app-globals";
import axios from "axios";
import io, { Socket } from "socket.io-client";

const httpURL = isLocal() 
    ? "http://127.0.0.1:5001/screen-recorder-b7354/us-central1/default" 
    : "";
const socketURL = isLocal()
    ? "http://127.0.0.1:5000/"
    : "";

const httpEndpoint = axios.create({
    baseURL: httpURL,
    timeout: 0
});

httpEndpoint.interceptors.response.use(
    (response) => response,
    (error) => {
        const response = error.response;

        if (response) {
            error = { ...response.data };
        }

        return Promise.reject(error);
    }
);

const socketEndpoint = io(
    socketURL, 
    { withCredentials: true }
);

const onConnect = (callback: (socket: Socket) => void) => {
    httpEndpoint.defaults.headers.common["socket-id"] = socketEndpoint.id;
    callback(socketEndpoint);
};

const onDisconnect = (callback: (socket: Socket) => void) => {
    httpEndpoint.defaults.headers.common["socket-id"] = "";
    callback(socketEndpoint);
};

const Api = {
    httpEndpoint,
    socketEndpoint,
    
    ping: async () => {
        await httpEndpoint.get("/ping");
    },

    onConnect(callback: (socket: Socket) => void) {
        socketEndpoint.on("connect", () => onConnect(callback));
    },
    onDisconnect(callback: (socket: Socket) => void) {
        socketEndpoint.on("disconnect", () => onDisconnect(callback));
    },

    auth: {
        recoverSession: async () => {
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                
                const { data } = await httpEndpoint.post("/refresh/session", { refreshToken });
                
                const user = new User(data.user);
                httpEndpoint.defaults.headers.common.authorization = data.token;

                return user;
            } catch {
                localStorage.removeItem("refreshToken");
                return undefined;
            }
        },
        login: async (email: string, password: string, rememberMe?: boolean) => {
            const { data } = await httpEndpoint.post("/login", { email, password, rememberMe });

            const token: string = data.token;
            const refreshToken: string = data.refreshToken;
            const rememberMeToken: string = data.rememberMeToken;

            httpEndpoint.defaults.headers.common.authorization = token;
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("rememberMeToken", rememberMeToken);

            return new User(data.user);

        },
        logout: async (userUid: string) => {
            await httpEndpoint.post(`/logout/${userUid}`);
            httpEndpoint.defaults.headers.common.authorization = "";
            localStorage.removeItem("refreshToken");
        },
        register: async (name: string, email: string, password: string) => {
            await httpEndpoint.put("/register", { name, email, password });
        },

        onUserUpdated: (callback: (user: User) => void) => {
            socketEndpoint.on(events.USER_UPDATED, callback);
        },
        offUserUpdated: (callback: (user: User) => void) => {
            socketEndpoint.off(events.USER_UPDATED, callback);
        }
    },
    friends: {
        getUserFriends: async () => {
            const { data } = await httpEndpoint.get("/get/friends");
            return (data.friends as any[]).map(friend => new User(friend));
        },

        onFriendUpdated: (callback: (friend: User) => void) => {
            socketEndpoint.on(events.FRIEND_UPDATED, callback);
        },
        offFriendUpdated: (callback: (friend: User) => void) => {
            socketEndpoint.off(events.FRIEND_UPDATED, callback);
        }
    },
    chats: {
        getUserChats: async () => {
            const { data } = await httpEndpoint.get("/get/chats");
            return (data.chats as any[]).map(chat => new Chat(chat));
        },
        getChatMembers: async (chatUid: string) => {
            const { data } = await httpEndpoint.get(`/get/${chatUid}/members`);
            return (data.members as any[]).map(member => new User(member));
        },
        getChatMessages: async (
            chatUid: string, 
            limit?: number, 
            startAfter?: string
        ) => {
            const { data } = await httpEndpoint.get(
                `/chat/${chatUid}/messages/?limit=${limit}&startAfter=${startAfter}`
            );
            return (data.messages as any[]).map(message => {
                if (message.type === "text") {
                    return new TextMessage(message);
                } else if (message.type === "audio") {
                    return new AudioMessage(message);
                } else if (message.type === "video") {
                    return new VideoMessage(message);
                } else {
                    return new Message(message);
                }
            });
        },

        onChatUpdated: (callback: (chat: Chat) => void) => {
            socketEndpoint.on(events.CHAT_UPDATED, callback);
        },
        offChatUpdated: (callback: (chat: Chat) => void) => {
            socketEndpoint.off(events.CHAT_UPDATED, callback);
        }
    },
    messages: {
        onMessageSent: (callback: (message: Message) => void) => {
            socketEndpoint.on(events.MESSAGE_SENT, callback);
        },
        offMessageSent: (callback: (message: Message) => void) => {
            socketEndpoint.off(events.MESSAGE_SENT, callback);
        },

        onTextMessageSent: (callback: (message: TextMessage) => void) => {
            socketEndpoint.on(events.TEXT_MESSAGE_SENT, callback);
        },
        offTextMessageSent: (callback: (message: TextMessage) => void) => {
            socketEndpoint.off(events.TEXT_MESSAGE_SENT, callback);
        },

        onVideoMessageSent: (callback: (message: VideoMessage) => void) => {
            socketEndpoint.on(events.VIDEO_MESSAGE_SENT, callback);
        },
        offVideoMessageSent: (callback: (message: VideoMessage) => void) => {
            socketEndpoint.off(events.VIDEO_MESSAGE_SENT, callback);
        },

        onAudioMessageSent: (callback: (message: AudioMessage) => void) => {
            socketEndpoint.on(events.AUDIO_MESSAGE_SENT, callback);
        },
        offAudioMessageSent: (callback: (message: AudioMessage) => void) => {
            socketEndpoint.off(events.AUDIO_MESSAGE_SENT, callback);
        }
    },
    users: {
        searchUsers: async (filters: FilterParams) => {
            const { data } = await httpEndpoint.post("/search/users", { filters });
            return (data.user as any[]).map(user => new User(user));
        },
        onUserUpdated: (callback: (user: User) => void) => {
            socketEndpoint.on(events.USER_UPDATED, callback);
        },
        offUserUpdated: (callback: (user: User) => void) => {
            socketEndpoint.on(events.USER_UPDATED, callback);
        }
    }
};

export default Api;