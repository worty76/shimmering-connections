const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Chat = require("./src/models/message");

require("dotenv").config();

const userRouter = require("./src/routers/userRouter");
const authRouter = require("./src/routers/authRouter");
const chatRouter = require("./src/routers/chatRouter");

var corsOptions = {
  origin: "http://localhost:8081",
  credentials: true,
  optionSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "src", "controllers", "uploads"))
);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Worty's server");
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["polling"],
});

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined room`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      console.log("data", data);

      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Error handling the messages", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
