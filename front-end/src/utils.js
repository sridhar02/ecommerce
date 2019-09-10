import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";

import { withStyles } from "@material-ui/styles";

const navbarStyles = {
  navbar: {},
  flipkart: {},
  button: {
    padding: "10px",
    margin: "0 10px",
    border: 0,
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    backgroundColor: "blue"
  }
};

function _Navbar(props) {
  const { classes } = props;
  return (
    <nav className="nav-bar">
      <span className="flipkart">Flipkart</span>
      <input className="search-input" placeholder="Search products" />
      <Button className={classes.button} component={Link} to="/account">
        USER
      </Button>
      <Button className={classes.button}>CART</Button>
      <Button className={classes.button}>sign-out</Button>
    </nav>
  );
}

export const Navbar = withStyles(navbarStyles)(_Navbar);
