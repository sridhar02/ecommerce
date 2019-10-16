import React, { Component, Fragment } from "react";

import Router from "next/router";

import { withStyles } from "@material-ui/core/styles";

import Link from "next/link";

import { Button, TextField, Typography } from "@material-ui/core";

import axios from "axios";

import cx from "classnames";

const signupStyles = theme => ({
  mainSection: {
    marginTop: theme.spacing(3)
  },

  text: {
    padding: theme.spacing(2)
  },

  signup: {
    fontSize: "29px",
    fontWeight: "500"
  },

  signupButton: {
    background: "#fb641b",
    color: "#fff"
  },
  sideBar: {
    backgroundColor: "lightblue"
  },
  navBar: {
    backgroundColor: "blue"
  },
  button: {
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    backgroundColor: "blue"
  }
});

class _Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      phonenumber: "",
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
      .post("/user/signup", {
        username: this.state.username,
        email: this.state.email,
        phonenumber: this.state.phonenumber,
        password: this.state.password
      })
      .then(response => Router.push("/login"))
      .catch(error => {
        console.log(error);
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
            <span className={classes.signup}>Signup</span>
            <p className={classes.displayText}>
              <span>
                Get access to your Orders, Wishlist and Recommendations
              </span>
            </p>
          </div>
          <form onSubmit={this.handleSubmit} className="col-12 col-md-4">
            <div
              className={cx(classes.signupLayout, "row justify-content-center")}
            >
              <TextField
                type="text"
                name="username"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={this.handleChange}
                className={classes.text}
              />
            </div>
            <div className="row justify-content-center">
              <TextField
                type="text"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
                className={classes.text}
              />
            </div>
            <div className="row justify-content-center">
              <TextField
                name="phonenumber"
                placeholder="Enter your phone number"
                value={this.state.phonenumber}
                onChange={this.handleChange}
                className={classes.text}
              />
            </div>
            <div className="row justify-content-center">
              <TextField
                name="password"
                type="password"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.handleChange}
                className={classes.text}
              />
            </div>
            <div className="row justify-content-center">
              <Button className={classes.signupButton} type="submit">
                Continue
              </Button>
            </div>
            <div className="row justify-content-center">
              <Link href="/login">
                <a>Existing account/login</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const Signup = withStyles(signupStyles)(_Signup);

export default Signup;
