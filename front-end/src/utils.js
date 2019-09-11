import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";

import { withStyles } from "@material-ui/styles";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

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

class _Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signOut: false
    };
  }
  onSignout = () => {
    localStorage.removeItem("secret");
    this.setState({
      signOut: true
    });
  };
  render() {
    const { classes } = this.props;
    if (this.state.signOut) {
      return <Redirect to="/login" />;
    }
    return (
      <nav className="nav-bar">
        <span className="flipkart">Flipkart</span>
        <input className="search-input" placeholder="Search products" />
        <Button className={classes.button} component={Link} to="/account">
          USER
        </Button>
        <Button className={classes.button}>CART</Button>
        <Button className={classes.button} onClick={this.onSignout}>
          signout
        </Button>
      </nav>
    );
  }
}

export const Navbar = withStyles(navbarStyles)(_Navbar);
