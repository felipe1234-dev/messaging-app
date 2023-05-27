import {
    FilterParams,
    User,
    Chat,
    Message,
    TextMessage,
    AudioMessage,
    VideoMessage,
    secureUserData,
} from "messaging-app-globals";
import { isLocal } from "@functions";
import { ResponseError, isResponseError, Unsubscribe } from "@types";
import axios, { AxiosError } from "axios";
import {
    auth,
    chatCollection,
    messageCollection,
    userCollection,
} from "./firebase";

const apiURL = isLocal()
    ? "http://127.0.0.1:5001/screen-recorder-b7354/us-central1/default"
    : "";

const httpEndpoint = axios.create({
    baseURL: apiURL,
    timeout: 0,
});

httpEndpoint.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const responseData = error.response?.data;

        if (isResponseError(responseData)) {
            const responseError: ResponseError = {
                ...error,
                ...responseData,
            };

            return Promise.reject(responseError);
        } else {
            return Promise.reject(error);
        }
    }
);

const Api = {
    httpEndpoint,

    ping: async () => {
        await httpEndpoint.get("/ping");
    },

    auth: {
        recoverSession: async () => {
            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const { data } = await httpEndpoint.post("/refresh/session", {
                    refreshToken,
                });

                const user = new User(data.user);
                httpEndpoint.defaults.headers.common.authorization = data.token;
                await auth.signInAnonymously();

                return user;
            } catch {
                localStorage.removeItem("refreshToken");
                await auth.signOut();
                return undefined;
            }
        },
        login: async (
            email: string,
            password: string,
            rememberMe?: boolean
        ) => {
            const { data } = await httpEndpoint.post("/login", {
                email,
                password,
                rememberMe,
            });

            const token: string = data.token;
            const refreshToken: string = data.refreshToken;
            const rememberMeToken: string = data.rememberMeToken;

            httpEndpoint.defaults.headers.common.authorization = token;
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("rememberMeToken", rememberMeToken);
            await auth.signInAnonymously();

            return new User(data.user);
        },
        logout: async () => {
            await httpEndpoint.post("/logout/");
            httpEndpoint.defaults.headers.common.authorization = "";
            localStorage.removeItem("refreshToken");
            await auth.signOut();
        },
        register: async (name: string, email: string, password: string) => {
            await httpEndpoint.put("/register", { name, email, password });
        },
    },
    friends: {
        getUserFriends: async () => {
            const { data } = await httpEndpoint.get("/get/friends");
            return (data.friends as any[]).map((friend) => new User(friend));
        },

        onFriendUpdated: (
            userUid: string,
            callback: (friend: User) => void
        ): Unsubscribe => {
            return userCollection
                .where("friends", "array-contains", userUid)
                .onSnapshot((snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "modified") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Friend not found");

                        const friend = secureUserData(new User(doc.data()));
                        callback(friend);
                    }
                });
        },
    },
    chats: {
        getUserChats: async () => {
            const { data } = await httpEndpoint.get("/get/chats");
            return (data.chats as any[]).map((chat) => new Chat(chat));
        },
        getChatMembers: async (chatUid: string) => {
            const { data } = await httpEndpoint.get(`/chat/${chatUid}/members`);
            return (data.members as any[]).map((member) => new User(member));
        },
        getChatMessages: async (
            chatUid: string,
            filters: {
                limit?: number;
                startAfter?: string;
                orderBy?: [field: string, direction: "desc" | "asc"]
            } = {}
        ) => {
            let url = `/chat/${chatUid}/messages/?`;
            const urlQueries: string[] = [];

            for (const [key, value] of Object.entries(filters)) {
                urlQueries.push(`${key}=${value}`);
            }

            url += urlQueries.join("&");

            const { data } = await httpEndpoint.get(url);
            
            return (data.messages as any[]).map((message) => {
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
        onUserChatUpdated: (
            userUid: string,
            callback: (chat: Chat) => void
        ): Unsubscribe => {
            return chatCollection
                .where("members", "array-contains", userUid)
                .onSnapshot((snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "modified") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Chat not found");

                        const chat = new Chat(doc.data());
                        callback(chat);
                    }
                });
        },
    },
    messages: {
        onMessageSentToChat: (
            chatUid: string,
            callback: (message: Message) => void
        ): Unsubscribe => {
            return messageCollection
                .where("chat", "==", chatUid)
                .onSnapshot((snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const msg = new Message(doc.data());
                        callback(msg);
                    }
                });
        },
        onTextMessageSentToChat: (
            chatUid: string,
            callback: (message: TextMessage) => void
        ) => {
            return messageCollection
                .where("chat", "==", chatUid)
                .onSnapshot((snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const data = doc.data();
                        if (!TextMessage.isTextMessage(data)) continue;

                        const msg = new TextMessage(data);
                        callback(msg);
                    }
                });
        },
        onVideoMessageSentToChat: (
            chatUid: string,
            callback: (message: VideoMessage) => void
        ) => {
            return messageCollection
                .where("chat", "==", chatUid)
                .onSnapshot((snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const data = doc.data();
                        if (!VideoMessage.isVideoMessage(data)) continue;

                        const msg = new VideoMessage(data);
                        callback(msg);
                    }
                });
        },
        onAudioMessageSentToChat: (
            chatUid: string,
            callback: (message: AudioMessage) => void
        ) => {
            return messageCollection
                .where("chat", "==", chatUid)
                .onSnapshot((snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const data = doc.data();
                        if (!AudioMessage.isAudioMessage(data)) continue;

                        const msg = new AudioMessage(data);
                        callback(msg);
                    }
                });
        },
    },
    users: {
        searchUsers: async (filters: FilterParams) => {
            const { data } = await httpEndpoint.post("/search/users", {
                filters,
            });
            return (data.user as any[]).map((user) => new User(user));
        },
        onUserUpdated: (
            userUid: string,
            callback: (user: User) => void
        ): Unsubscribe => {
            return userCollection.doc(userUid).onSnapshot((snapshot) => {
                if (!snapshot.exists) throw new Error("User not found");

                const user = secureUserData(new User(snapshot.data()));
                callback(user);
            });
        },
    },
};

export default Api;
