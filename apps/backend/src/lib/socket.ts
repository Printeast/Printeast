import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: env.ALLOWED_ORIGINS.split(","),
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"], // Enforce WebSocket preference
    });

    // Use Redis Adapter for scalability (if we run multi-instance backend later)
    // Note: Requires subClient. For now, we start simple without adapter or add it if needed.
    // io.adapter(createAdapter(redis, redisSubscriber)); 

    io.on("connection", (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Auth check placeholder (Middleware)
        // socket.use(...)

        socket.on("disconnect", () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    console.log("[Socket] Initialized");
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
