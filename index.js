const express = require("express");
const cors = require("cors");
require("dotenv").config();
const UserRouter = require("./api/routers/User.router");
const FollowingRouter = require("./api/routers/Following.router");
const TweetRouter = require("./api/routers/Tweet.router");
const AuthRouter = require("./api/routers/Auth.router");
const mongoDB = require("./api/configs/mongoDb");
const app = express();

//connection database - MongoDB
mongoDB.connection();

app.use(cors());
//middlewares
app.use(express.json());

app.use(`/api/${process.env.API_VERSION}/users`, UserRouter);
app.use(`/api/${process.env.API_VERSION}/follows`, FollowingRouter);
app.use(`/api/${process.env.API_VERSION}/tweets`, TweetRouter);
app.use(`/api/${process.env.API_VERSION}/auth`, AuthRouter);

app.listen(process.env.PORT, () => {
  console.log(`El servidor está escuchando en el puerto: ` + process.env.PORT);
});

app.use((error, req, res, next) => {
  console.log(error);
  if (!error.status) {
    res.status(500).json({
      message: "Ocurrió un error en el servidor",
    });
  } else {
    res.status(error.status).json({ message: error.message });
  }
  //   if (process.env.TYPE === "DEVEPLOMENT") {
  //     console.log("error.....................");
  //   } else {
  //   }
});
