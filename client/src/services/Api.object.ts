import { isLocal } from "@functions";
import { User, events } from "messaging-app-globals";
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

const Api = {
    httpEndpoint,
    socketEndpoint,
    
    ping: async () => {
        await httpEndpoint.get("/ping");
    },

    onConnect(callback: (socket: Socket) => void) {
        const onConnect = () => {
            httpEndpoint.defaults.headers.common["socket-id"] = socketEndpoint.id;
            callback(socketEndpoint);
        };
        socketEndpoint.on("connect", onConnect);
    },
    offConnect(callback: (socket: Socket) => void) {
        const offConnect = () => {
            httpEndpoint.defaults.headers.common["socket-id"] = "";
            callback(socketEndpoint);
        };
        socketEndpoint.off("connect", offConnect);
    },

    onDisconnect(callback: (socket: Socket) => void) {
        const onDisconnect = () => {
            httpEndpoint.defaults.headers.common["socket-id"] = "";
            callback(socketEndpoint);
        };
        socketEndpoint.on("disconnect", onDisconnect);
    },
    offDisconnect(callback: (socket: Socket) => void) {
        const offDisconnect = () => {
            httpEndpoint.defaults.headers.common["socket-id"] = "";
            callback(socketEndpoint);
        };
        socketEndpoint.off("disconnect", offDisconnect);
    },

    auth: {
        recoverSession: async () => {
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                
                const { data } = await httpEndpoint.post("/refresh/session", { refreshToken });
                
                const user = new User(data.user);
                httpEndpoint.defaults.headers.common.authorization = user.token;

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
    }
};

export default Api;