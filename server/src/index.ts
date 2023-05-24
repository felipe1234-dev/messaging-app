// @ts-ignore
import * as functions from "firebase-functions";
import express from "express";

import { useRouteMiddleware } from "@utils";
import {
    corsMiddleware,
    responseFormatterMiddleware,
    logRequestsMiddleware,
} from "@middlewares";
import {
    usersRouter,
    messagesRouter,
    chatsRouter,
    friendsRouter,
} from "@routes";
import { expireTokens } from "@schedules";

const app = express();

// Global route middlewares
app.use("/*", useRouteMiddleware(responseFormatterMiddleware));
app.use("/*", useRouteMiddleware(corsMiddleware));
app.use("/*", useRouteMiddleware(logRequestsMiddleware));

// Ping
app.get("/ping", (req, res) => res.status(200).send("Ping"));

// HTTP routes
usersRouter(app);
messagesRouter(app);
chatsRouter(app);
friendsRouter(app);

// Schedules
setInterval(() => expireTokens(), 1 * 60 * 1000);

export default functions.https.onRequest(app);
