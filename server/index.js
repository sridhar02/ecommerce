require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware

app.use(cors());
app.use(express.json()); //req.body

const PORT = 5000;

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, phonenumber } = req.body;
    const createUser = await pool.query(
      `INSERT INTO users(username,email,password,phonenumber,created_at,updated_at)
      VALUES($1,$2,$3,$4,$5,$6)`,
      [username, email, password, phonenumber, new Date(), new Date()]
    );
    console.log(createUser);
    res.json("user created sucessfully");
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
    if(password === rows.rows[0].password ){
      res.json("get user sucess")
    }
    console.log(rows.rows[0].password);
    res.json("username or password is wrong");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
