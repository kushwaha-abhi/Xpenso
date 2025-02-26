import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import connectMongoDBStore from "connect-mongodb-session";
import cors from "cors";
import dotenv from "dotenv";
import connetToDB from "./config/db.js";
import groupRouter from "./routes/groupRoutes.js";
import userRouter from "./routes/userRoutes.js";
const app = express();
dotenv.config();
const MongoDBStore = connectMongoDBStore(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});

app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
  store: store, 
  cookie: { maxAge: null } 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port: http://localhost:${process.env.PORT}`
  );
});
connetToDB();

app.use("/api/group", groupRouter);
app.use("/api/users", userRouter);