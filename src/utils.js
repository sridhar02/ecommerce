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

import ShoppingCart from "@material-ui/icons/ShoppingCart";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Assignment from "@material-ui/icons/Assignment";
import ExitToApp from "@material-ui/icons/ExitToApp";

const navbarStyles = (theme) => ({
  button: {
    padding: theme.spacing(1.5),
    margin: "0 10px",
    fontWeight: "bold",
    fontSize: theme.spacing(2.5),
    color: "white",
  },
  flipkart: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(1),
    },
  },
  searchInput: {
    backgroundColor: "white",
    margin: theme.spacing(1),
    width: "100%",
  },
  login: {
    color: "white",
  },
});

class _Navbar extends Component {
  onSignout = () => {
    localStorage.removeItem("secret");
    Router.push("/login");
  };
  render() {
    const { classes, search, setSearch } = this.props;
    let authorized;
    let iconAuthorized;
    if (typeof window !== "undefined" && localStorage.getItem("secret")) {
      authorized = (
        <div className="d-none d-md-block col-md-6">
          <Link href="/account">
            <Button color="inherit">USER</Button>
          </Link>
          <Link href="/viewcart">
            <Button color="inherit">CART</Button>
          </Link>
          <Link href="/orders">
            <Button color="inherit">ORDERS</Button>
          </Link>
          <Button color="inherit" onClick={this.onSignout}>
            SIGNOUT
          </Button>
        </div>
      );
      iconAuthorized = (
        <div className="d-md-none">
          <Link href="/account">
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          </Link>
          <Link href="/viewcart">
            <IconButton color="inherit">
              <ShoppingCart />
            </IconButton>
          </Link>
          <Link href="/orders">
            <IconButton color="inherit">
              <Assignment />
            </IconButton>
          </Link>
          <IconButton color="inherit">
            <ExitToApp />
          </IconButton>
        </div>
      );
    } else {
      authorized = (
        <div>
          <Link href="/login">
            <Button className={classes.login}>login</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <div className="container">
            <div className="row">
              <div className="col-4 col-md-2">
                <Link href="/products">
                  <img className={classes.flipkart} src="/static/logo.png" />
                </Link>{" "}
              </div>
              {iconAuthorized}
              <div className="col-12 col-md-4">
                <InputBase
                  id="outlined-bare"
                  variant="outlined"
                  inputProps={{ "aria-label": "bare" }}
                  className={classes.searchInput}
                  placeholder="Search products"
                />
              </div>
              {authorized}
            </div>
          </div>
        </AppBar>
      </div>
    );
  }
}

export const Navbar = withStyles(navbarStyles)(_Navbar);

export function authHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("secret")}`,
    },
  };
}
