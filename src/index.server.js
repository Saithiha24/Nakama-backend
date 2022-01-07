const express = require("express");
const app = express();
const env = require("dotenv");
const { chats } = require("./data/data");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

// middleware
app.use(cors());
env.config();
app.use(express.json());
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.07vki.mongodb.net/${process.env.MONGO_DB_DATA_BASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Database connected");
  });

// Routesw
app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat:id", (req, res) => {
  const singleChat = chats.find((chat) => chat._id === req.params.id);
  res.end(singleChat);
});

app.use("/api", authRoutes);
// PORT
const port = process.env.PORT;
app.listen(process.env.PORT, () => console.log(`app is running`));
