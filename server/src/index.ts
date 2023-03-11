// @ts-ignore
import * as functions from "firebase-functions";
import http from "http";

import express from "express";
import socket from "socket.io";

import configs from "@configs";
import { useRouteMiddleware, useSocketMiddleware } from "@utils";

import {
    startSocketServerMiddleware,
    corsMiddleware,
    responseFormatterMiddleware,
    logRequestsMiddleware
} from "@middlewares/routes";
import {
    usersRouter,
    messagesRouter,
    chatsRouter,
    friendsRouter
} from "@routes";

import {
    logConenctionsMiddleware,
    logDisconenctionsMiddleware
} from "@middlewares/sockets";

import {
    expireTokens
} from "@schedules";

const app = express();
const server = http.createServer(app);
const io = new socket.Server(server, {
    cors: {
        origin: configs.allowedOrigins,
        credentials: true,
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"]
    }
});

// Global route middlewares
app.use("/*", useRouteMiddleware(responseFormatterMiddleware, io));
app.use("/*", useRouteMiddleware(startSocketServerMiddleware, io));
app.use("/*", useRouteMiddleware(corsMiddleware, io));
app.use("/*", useRouteMiddleware(logRequestsMiddleware, io));

// Ping
app.get("/ping", (req, res) => res.status(200).send("Ping"));

// HTTP routes
usersRouter(app, io);
messagesRouter(app, io);
chatsRouter(app, io);
friendsRouter(app, io);

// Global socket middlewares
io.use(useSocketMiddleware(logConenctionsMiddleware, io));
io.use(useSocketMiddleware(logDisconenctionsMiddleware, io));

// Sockets
io.on("connect", socket => {
    // Socket events
});

// Schedules
setInterval(() => expireTokens(io), 1 * 60 * 1000);

export default functions.https.onRequest(app);