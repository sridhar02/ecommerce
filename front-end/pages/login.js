import React, { Component, Fragment } from "react";
import Router from "next/router";

import { withStyles } from "@material-ui/core/styles";

import Link from "next/link";

import { Button, TextField, Typography } from "@material-ui/core";

const loginStyles = theme => ({
  order: {
    display: "flex"
  },
  mainSection: {
    paddingLeft: "200px",
    paddingTop: "50px",
    maxWidth: "1000px",
    margin: "0 auto",
    height: "600px",
    display: "flex",
    flex: "center"
  },
  space: {
    paddingTop: "40px"
  },
  login: {
    fontSize: "29px",
    fontWeight: "500"
  },
  displayText: {
    fontSize: "18px",
    marginTop: "16px",
    lineHeight: "150%"
  },
  loginLayout: {
    margin: "15px",
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    height: "600px"
  },

  loginButton: {
    marginTop: "36px",
    padding: "10px",
    background: "#fb641b",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    border: "none",
    color: "#fff"
  },

  password: {
    marginTop: "36px",
    padding: "10px"
  },

  loginText: {
    padding: "10px"
  },
  sideBar: {
    padding: "10px",
    margin: "15px",
    backgroundColor: "lightblue",
    width: "300px",
    height: "300px",
    display: "inline-block",
    flexDirection: "column"
  },
  createAccount: {
    marginTop: "35px",
    padding: "10px"
  }
});

class _Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch(`${process.env.API_URL}/user/sign_in`, {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => {
        if (response.status === 201) {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          localStorage.setItem("secret", data.secret);
          Router.push("/products");
        }
      });
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.mainSection}>
        <div className={classes.sideBar}>
          <span className={classes.login}>Login</span>
          <p className={classes.displayText}>
            <span>Get access to your Orders, Wishlist and Recommendations</span>
          </p>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={classes.loginLayout}>
            <TextField
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Enter Email/Mobile Number"
              className={classes.loginText}
            />
            <TextField
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Enter password"
              className={classes.password}
            />
            <Button className={classes.loginButton} type="submit">
              Login
            </Button>
            <div className={classes.space}>
              <Link href="/sign_up">
                <a> New to Flipkart? Create an account</a>
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const Login = withStyles(loginStyles)(_Login);

export default Login;
