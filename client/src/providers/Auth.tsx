import React, { createContext, useContext, useState, useEffect } from "react";
import { User, codes } from "messaging-app-globals";
import { Api } from "@services";
import { useUnmount } from "@hooks";

interface AuthValue {
    user?: User;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

function AuthProvider(props: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>();
    const [friends, setFriends] = useState<User[]>([]);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const response = await Api.auth.login(email, password, rememberMe);
        setUser(response);
    };

    const logout = async () => {
        if (!user) return;
        await Api.auth.logout(user.uid);
        setUser(undefined);
    };

    const onFriendUpdated = async (updatedFriend: User) => {
        setFriends(prev => prev.map(friend => {
            if (friend.uid === updatedFriend.uid) return updatedFriend;
            return friend;
        }))
    };

    const onConnect = async () => {
        const user = await Api.auth.recoverSession();
        setUser(user);
        
        Api.auth.onUserUpdated(setUser);
        Api.friends.onFriendUpdated(onFriendUpdated);
    };

    const onDisconnect = async () => {
        await logout();
        Api.auth.offUserUpdated(setUser);
        Api.friends.offFriendUpdated(onFriendUpdated);
    };

    useEffect(() => {
        Api.httpEndpoint.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.code === codes.UNAUTHENTICATED) await logout();
                return Promise.reject(error);
            }
        );
        
        Api.onConnect(onConnect);
        Api.onDisconnect(onDisconnect);
    }, []);

    useUnmount(() => {
        Api.offConnect(onConnect);
        Api.offDisconnect(onDisconnect);
    });

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

export { AuthContext, AuthProvider, useAuth };