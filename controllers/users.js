const connection = require("../SQL/connection");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const supersecret = process.env.SUPERSECRET;

function getUsers(req, res) {
  console.log("Inside get /users");
  console.log(req.user_id);
  let sql = "SELECT * FROM users";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.log(err.sqlMessage);
      res.status(500).send("Did not get rows");
    }
    res.json(rows);
  });
}

async function createUser(req, res) {
  console.log("Inside users route", req.body);
  const { user_name, user_password } = req.body;
  console.log(user_name);
  let sql = "INSERT INTO users (user_name, user_password) VALUES (?, ?)";
  let hash = await argon2.hash(user_password);
  connection.query(sql, [user_name, hash], (err, results) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status(500).send("Did not get correct body info");
    }
    console.log(results);
    res.json(`Inserted user at ${results.insertId}`);
  });
}

async function login(req, res) {
  console.log("Inside login route");
  const name = req.body.user_name;
  const password = req.body.user_password;
  let sql =
    "SELECT user_password, user_name, user_id FROM users WHERE user_name = ?";
  connection.query(sql, [name], async (err, results) => {
    if (err) {
      console.log(results);
      console.log(err.sqlMessage);
      return res.status(500).send("Did not get correct info");
    }
    if (results.length == 0) {
      return res.status(400).json("user name is not found");
    }
    if (results.length == 1) {
      let hash = results[0].user_password;
      let good_password;
      try {
        good_password = await argon2.verify(hash, password);
      } catch (error) {
        console.log(error);
        return res.status(500).json("Internal server error");
      }
      if (good_password) {
        const unsigned_token = {
          user_name: results[0].user_name,
          user_id: results[0].user_id,
        };
        const token = jwt.sign(unsigned_token, supersecret);
        console.log(token);

        return res.json(token);
      } else {
        return res.status(500).json("password is not correct");
      }
    }
    console.log("uhoh");
    res.sendStatus(500);
  });
}

module.exports = { getUsers, createUser, login };
