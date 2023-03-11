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
app.use("/*", useRouteMiddleware(startSocketServerMiddleware, io));
app.use("/*", useRouteMiddleware(corsMiddleware, io));
app.use("/*", useRouteMiddleware(responseFormatterMiddleware, io));
app.use("/*", useRouteMiddleware(logRequestsMiddleware, io));

// Global socket middlewares
io.use(useSocketMiddleware(logConenctionsMiddleware, io));
io.use(useSocketMiddleware(logDisconenctionsMiddleware, io));

// Ping
app.get("/ping", (req, res) => res.status(200).send("Ping"));

// Sockets
io.on("connect", socket => {
    // Socket events
    
});

io.on("connection", socket => {
    // HTTP routes
    usersRouter(app, socket, io);
    messagesRouter(app, socket, io);
    chatsRouter(app, socket, io);
    friendsRouter(app, socket, io);

    // Schedules
    setInterval(() => expireTokens(socket, io), 1 * 60 * 1000);
});

export default functions.https.onRequest(app);