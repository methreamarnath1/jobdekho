const express = require("express");
const mongoose = require("mongoose"); //used for connecting to mongoDB
const cors = require("cors"); //used for enabled the cors= which allows the server to accept requests from diffrent origen
require("dotenv").config(); //used for accessing the environment variables from the .env file

const app = express();

//middlewares
app.use(express.json()); //used for parsing the incoming request with JSON Payloads
app.use(cors()); //enables the cors

//Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.error("could not connect to mongoDB", err));

//Routes
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

const PORT = process.env.PORT || 5000; //if the PORT is not defined in the environment variables, it will use 5000 as default
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
