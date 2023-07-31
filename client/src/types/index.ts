import { User, Chat, Message, codes } from "messaging-app-globals";
import { IconProps } from "@styles/layout/Icon";
import firebase from "firebase/compat";

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
    getNewestMessage(): Message | undefined;
    getOldestMessage(): Message | undefined;
    loadMoreMessages(): Promise<Message[]>;
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

export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;
export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;
export type DocumentData = firebase.firestore.DocumentData;

export type DocumentListener = (
    snapshot: DocumentSnapshot<DocumentData>
) => void;
export type QueryListener = (snapshot: QuerySnapshot<DocumentData>) => void;
