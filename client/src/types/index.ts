import { User, Chat, Message, codes } from "messaging-app-globals";
import { IconProps } from "@styles/layout/Icon";

export * from "./is";

export type Severity = "error" | "warning" | "info" | "success";
export type Variant =
    | "primary"
    | "secondary"
    | "highlight"
    | "remove"
    | "reject"
    | "cancel"
    | Severity;
export type Direction = "row" | "column";
export type Align = "start" | "end" | "center" | "baseline";
export type Justify =
    | "center"
    | "start"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch";
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
export type FontStyle = "normal" | "italic" | "oblique";
export type Unsubscribe = () => void;

export interface WrapperUser extends User {}

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

export interface HashMap<T> {
    [key: string]: T;
}

export interface CustomIconProps extends Omit<IconProps, "icon"> {}
