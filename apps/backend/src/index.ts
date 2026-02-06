import { createServer } from "http";
import app from "./app";
import { env } from "./config/env";
import { initSocket } from "./lib/socket";

const PORT = env.PORT;

// Create HTTP server from Express app
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${env.NODE_ENV} mode`);
  console.log(` > WebSocket Server Ready`);
});
