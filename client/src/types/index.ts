import { User, Chat, Message, codes } from "messaging-app-globals";

export * from "./is";

export type Severity = "error" | "warning" | "info" | "success";
export type Variant = "primary" | "secondary" | "highlight" | Severity;
export type Position =
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center"
    | "center"
    | "center-left"
    | "center-right";
export type Unsubscribe = () => void;

export interface WrapperUser extends Omit<User, "friends"> {
    friends: User[];
}

export interface WrapperChat
    extends Omit<Chat, "members" | "blocked" | "admins" | "createdBy"> {
    members: User[];
    blocked: User[];
    admins: User[];
    createdBy: User;
    messages: Message[];

    getLastMessage(): Message;
}

export interface ResponseError {
    status: number;
    code: (typeof codes)[keyof typeof codes];
    message: string;
    [key: string]: any;
}
