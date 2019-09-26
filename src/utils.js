import React, { Component } from "react";

import Link from "next/link";

import { Button, TextField, Typography } from "@material-ui/core";

import { withStyles } from "@material-ui/styles";

import { Redirect } from "react-router-dom";

import Router from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";

const navbarStyles = theme => ({
  root: {
    flexGrow: 1,
    fontFamily: "Roboto,Arial,sans-serif",
    letterSpacing: "0"
    // maxWidth: "1248px"
  },
  button: {
    padding: theme.spacing(1.5),
    margin: "0 10px",
    fontWeight: "bold",
    fontSize: theme.spacing(2.5),
    color: "white"
  },
  space: {
    height: "100%",
    minWidth: "124px"
  },
  searchInput: {
    backgroundColor: "white",
    margin: "0 auto 0 12px",
    width: "50%"
  }
});

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
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.space}></div>
            <Link href="/products">
              <img className={classes.flipkart} src="/static/logo.png" />
            </Link>
            <InputBase
              id="outlined-bare"
              variant="outlined"
              inputProps={{ "aria-label": "bare" }}
              className={classes.searchInput}
              placeholder="Search products"
            />
            <Link href="/account">
              <Button color="inherit">USER</Button>
            </Link>
            <Link href="/viewcart">
              <Button color="inherit">CART</Button>
            </Link>
            <Link href="/orders">
              <Button color="inherit">ORDERS</Button>
            </Link>
            <Button
              // className={classes.button}
              color="inherit"
              onClick={this.onSignout}
            >
              SIGNOUT
            </Button>
            <div className={classes.space}></div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export const Navbar = withStyles(navbarStyles)(_Navbar);
