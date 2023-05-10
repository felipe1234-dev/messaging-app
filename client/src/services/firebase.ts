import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getEnv } from "@functions";

const firebaseConfig = {
    apiKey: getEnv("API_KEY"),
    authDomain: getEnv("AUTH_DOMAIN"),
    projectId: getEnv("PROJECT_ID"),
    storageBucket: getEnv("STORAGE_BUCKET"),
    messagingSenderId: getEnv("MESSAGING_SENDER_ID"),
    appId: getEnv("APP_ID")
};

const app = firebase.initializeApp(firebaseConfig, getEnv("PROJECT_ID"));
const firestore = app.firestore();
const storage = app.storage();
const auth = app.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { firestore, storage, auth };

const userCollection = firestore.collection("users");
const messageCollection = firestore.collection("messages");
const chatCollection = firestore.collection("chats");

export { userCollection, messageCollection, chatCollection };