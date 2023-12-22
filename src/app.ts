import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import logger from "./utils/logger";
import { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";

import { errorHandler } from "./middleware/error-handler";
import dbConnect from "./utils/dbConnect";
import authRoutes from "./auth/auth.routes";
import { notFoundHandler } from "./middleware/not-found";
import userRoutes from "./user/user.routes";
import chatRoutes from "./chat/chat.routes";
import messageRoutes from "./message/messages.routes";
import { Server } from "socket.io";

declare const userData: {
  uid: string;
};

const app = express();

//CORS CONFIGURATION
const whitelisted_origins = config.get("whitelisted_origins") as string;
whitelisted_origins.split(",");
const whitelist = whitelisted_origins.split(",");

const corsOptions: CorsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin) {
      //for bypassing postman req with  no origin
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Authorization", "X-Requested-With", "Content-Type"],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

//HELMET SETUP
app.use(helmet());

//CORS SETUP
app.use(cors(corsOptions));

//MORGAN SETUP - for http request logging
// const baseMorganTokenConfig = ":date[iso] :method :url :http-version :user-agent :status (:response-time ms)"
const baseMorganTokenConfig =
  ":date[iso] :method :url :http-version :status (:response-time ms)";
app.use(
  morgan(
    config.get("node_env") === "production" ? baseMorganTokenConfig : "dev"
  )
);

//EXPRESS SETUP
app.use(express.json());
//BODYPARSER SETUP
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = (config.get("port") as number) || 8000;

app.get("/", (req: Request, res: Response) => {
  return res.send("API is live");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  await dbConnect();
  logger.info(`server is listening on port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: whitelist,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "X-Requested-With", "Content-Type"],
    credentials: true,
    // maxAge: 86400,
  },
});

io.on("connection", (socket) => {
  logger.info("Successfully connected to socket");

  socket.on("setup", (userData: { uid: string }) => {
    socket.join(userData.uid);
    logger.info("setup room created for: " + userData.uid);
    socket.emit("connected");
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop_typing", (room) => socket.in(room).emit("stop_typing"));

  socket.on("join_chat", (room) => {
    socket.join(room);
    logger.info("User joined room: " + room);
  });

  socket.on(
    "new_message",
    (message: {
      sender: {
        _id: string;
        username: string;
        profilePhoto: string;
      };
      content: string;
      chat: {
        _id: string;
        chatName: string;
        isGroupChat: boolean;
        users: {
          _id: string;
          username: string;
          profilePhoto: string;
          email: string;
        }[];
        groupAdmin: string[];
        createdAt: string;
        updatedAt: string;
        __v: number;
        latestMessage: string;
      };
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }) => {
      let chat = message.chat;

      if (!chat.users) {
        return logger.warn("chat.user is undefined");
      }

      chat.users.forEach((user) => {
        if (user._id === message.sender._id) {
          return;
        }
        socket.in(user._id).emit("message_recieved", message);
      });
    }
  );

  socket.off("setup", () => {
    //userData.uid doesn't exist in out in the off method which is confusing to myself and typescript 🥲, so i used a modifier to resolve that
    logger.info("user disconnected");
    socket.leave(userData.uid);
  });
});
