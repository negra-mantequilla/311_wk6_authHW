require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users");
const clientsRoutes = require("./routes/clients");
const clientUsers = require("./routes/clientUsers")
const connection = require("./SQL/connection");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(userRoutes);
app.use(clientsRoutes);
app.use(clientUsers);

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
