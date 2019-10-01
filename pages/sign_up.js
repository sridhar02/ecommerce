import React, { Component, Fragment } from "react";

import Router from "next/router";

import { withStyles } from "@material-ui/core/styles";

import Link from "next/link";

import { Button, TextField, Typography } from "@material-ui/core";

import axios from "axios";

const signupStyles = theme => ({
  signupSidebar: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    margin: "0 auto"
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

  signupLayout: {
    margin: "15px",
    display: "flex",
    flexDirection: "column",
    height: "600px"
  },
  text: {
    marginTop: "20px",
    padding: "10px"
  },

  signup: {
    fontSize: "29px",
    fontWeight: "500"
  },

  signupButton: {
    background: "#fb641b",
    color: "#fff"
  },
  space1: {
    padding: "15px"
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
  navBar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "blue"
  },

  searchInput: {
    height: "36px",
    width: "50%"
  },
  button: {
    padding: "10px",
    margin: "0 10px",
    border: "0",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    backgroundColor: "blue"
  },
  space1: {
    padding: "15px"
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
      <div className={classes.mainSection}>
        <div className={classes.sideBar}>
          <span className={classes.signup}>Signup</span>
          <p className={classes.displayText}>
            <span>Get access to your Orders, Wishlist and Recommendations</span>
          </p>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={classes.signupLayout}>
            <TextField
              type="text"
              name="username"
              placeholder="Enter your username"
              value={this.state.username}
              onChange={this.handleChange}
              className={classes.loginText}
            />
            <TextField
              type="text"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
              className={classes.text}
            />
            <TextField
              name="phonenumber"
              placeholder="Enter your phone number"
              value={this.state.phonenumber}
              onChange={this.handleChange}
              className={classes.text}
            />
            <TextField
              name="password"
              type="password"
              placeholder="Enter your password"
              value={this.state.password}
              onChange={this.handleChange}
              className={classes.text}
            />
            <Button className={classes.signupButton} type="submit">
              Continue
            </Button>
            <div className={classes.space1}>
              <Link href="/login">
                <a>Existing account/login</a>
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const Signup = withStyles(signupStyles)(_Signup);

export default Signup;
