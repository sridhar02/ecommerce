import React, { Component, Fragment } from "react";
import Router from "next/router";
import cx from "classnames";

import { withStyles } from "@material-ui/core/styles";

import Link from "next/link";

import { Button, TextField, Typography } from "@material-ui/core";

import axios from "axios";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const loginStyles = theme => ({
  order: {
    display: "flex"
  },
  mainSection: {
    marginTop: theme.spacing(10)
  },
  space: {},
  login: {
    fontSize: "29px",
    fontWeight: "500"
  },
  displayText: {
    fontSize: "18px",
    lineHeight: "150%"
  },
  loginLayout: {},

  loginButton: {
    margin: theme.spacing(2),
    background: "#fb641b",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    border: "none",
    color: "#fff"
  },

  password: {
    padding: theme.spacing(2)
  },

  loginText: {
    padding: theme.spacing(2)
  },
  sideBar: {
    backgroundColor: "lightblue"
    // height: "300px",
  },
  createAccount: {}
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
    axios
      .post(`${process.env.API_URL}/user/sign_in`, {
        email: this.state.email,
        password: this.state.password
      })
      .then(response => {
        localStorage.setItem("secret", response.data.secret);
        Router.push("/products");
      });
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={cx(classes.mainSection, "container")}>
        <div className="row">
          <div
            className={cx(
              classes.sideBar,
              "col-md-4 offset-md-2 d-none d-md-block"
            )}
          >
            <span className={classes.login}>Login</span>
            <p className={classes.displayText}>
              <span>
                Get access to your Orders, Wishlist and Recommendations
              </span>
            </p>
          </div>
          <form onSubmit={this.handleSubmit} className={"col-12 col-md-4"}>
            <div className="row justify-content-center">
              <TextField
                name="email"
                type="text"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Enter Email/Mobile Number"
                className={classes.loginText}
              />
            </div>
            <div className="row justify-content-center">
              <TextField
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Enter password"
                className={cx(classes.password, "row")}
              />
            </div>
            <div className="row justify-content-center">
              <Button className={classes.loginButton} type="submit">
                Login
              </Button>
            </div>
            <div className={cx(classes.space, "row justify-content-center")}>
              <Link href="/sign_up">
                <a> New to Flipkart? Create an account</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const Login = withStyles(loginStyles)(_Login);

export default Login;
