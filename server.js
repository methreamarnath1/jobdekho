const express = require("express");
const mongoose = require("mongoose"); //used for connecting to mongoDB
const cors = require("cors"); //used for enabled the cors= which allows the server to accept requests from diffrent origen
//used for creating the router instance
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

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

// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

//basic routes
app.get("/", (req, res) => {
  res.send("Welcome to the User Management API");
});

const PORT = process.env.PORT || 5000; //if the PORT is not defined in the environment variables, it will use 5000 as default
app.listen(PORT, () => {
  
  console.log(`Server is running on port ${PORT}`);
  console.log(`https://localhost:${PORT}`);
});
