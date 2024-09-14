require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const sequelize = require("./bd");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const CorsMiddleware = require("./middleware/CorsMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "React app URL"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.static("static"));
app.use(fileUpload({}));
app.use("/api", router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("server starts on port:" + PORT));
  } catch (error) {
    console.log(error);
  }
};
start();
