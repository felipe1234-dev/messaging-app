import { User, Chat, Message } from "messaging-app-globals";

export type Severity = "error" | "warning" | "info" | "success";
export type Variant = "primary" | "secondary" | "highlight" | Severity;

export interface WrapperUser extends Omit<User, "friends"> {
    friends: User[];
}

export interface WrapperChat extends Omit<Chat, "members" | "blocked" | "admins" | "createdBy" | "deletedBy"> {
    members: User[];
    blocked: User[];
    admins: User[];
    createdBy: User;
    messages: Message[];
}