require("dotenv").config();
const cors = require("cors");
const { checkJwt } = require("./utils/checkjwt");

const express = require("express");

const userRoutes = require("./routes/users");
const clientsRoutes = require("./routes/clients");

// const router = require('./routes/routes')

const app = express();

const connection = require("./SQL/connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

app.use(userRoutes);
app.use(clientsRoutes);

const port = process.env.PORT || 8005;

app.get("/", (req, res) => {
  res.json("Hello World");
  connection.connect(function () {
    console.log("connected");
  });
});

app.listen(port, function () {
  console.log("listening on PORT ", port);
});
