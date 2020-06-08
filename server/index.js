require("dotenv").config();
const PORT = 5000;
const saltRounds = 10;

// required packages

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

//middleware
app.use(cors());
app.use(express.json()); //req.body

// routes

app.post("/user/signup", (req, res) => {
  try {
    const { username, email, password, phonenumber } = req.body;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const createUser = await pool.query(
        `INSERT INTO users(username,email,password,phonenumber,created_at,updated_at)
        VALUES($1,$2,$3,$4,$5,$6)`,
        [username, email, hash, phonenumber, new Date(), new Date()]
      );
      res.json("user created sucessfully");
    });
    console.log("user created sucessfully");
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/user/sign_in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const rows = await pool.query(
      `SELECT password,id FROM users WHERE email=$1`,
      [email]
    );
    const hash = rows.rows[0].password;
    bcrypt.compare(password, hash, (err, result) => {
      result
        ? res.json("get user sucess")
        : res.json("email or password is wrong");
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
