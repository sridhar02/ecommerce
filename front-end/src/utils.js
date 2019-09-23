import React, { Component } from "react";

import Link from "next/link";

import { Button, TextField, Typography } from "@material-ui/core";

import { withStyles } from "@material-ui/styles";

import { Redirect } from "react-router-dom";

import Router from "next/router";

const navbarStyles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "10px",
    backgroundColor: "blue"
  },
  flipkart: {
    margin: "0 10px",
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "20px"
  },
  button: {
    padding: "10px",
    margin: "0 10px",
    fontWeight: "bold",
    fontSize: "18px",
    color: "white"
    // backgroundColor: "blue"
  },
  searchInput: {
    backgroundColor: "white",
    width: "50%"
  }
};

class _Navbar extends Component {
  constructor(props) {
    super(props);
  }
  onSignout = () => {
    localStorage.removeItem("secret");
    Router.push("/login");
  };
  render() {
    const { classes } = this.props;
    return (
      <nav className={classes.navbar}>
        <Link href="/products">
          <img className={classes.flipkart} src="/static/logo.png" />
        </Link>
        <TextField
          id="outlined-bare"
          margin="normal"
          variant="outlined"
          inputProps={{ "aria-label": "bare" }}
          className={classes.searchInput}
          placeholder="Search products"
        />
        <Link href="/account">
          <Button className={classes.button}>USER</Button>
        </Link>
        <Link href="/viewcart">
          <Button className={classes.button}>CART</Button>
        </Link>
        <Link href="/orders">
          <Button className={classes.button}>ORDERS</Button>
        </Link>
        <Button className={classes.button} onClick={this.onSignout}>
          SIGNOUT
        </Button>
      </nav>
    );
  }
}

export const Navbar = withStyles(navbarStyles)(_Navbar);
