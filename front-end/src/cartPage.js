import React, { Component, Fragment } from "react";

import { Navbar } from "./utils";

import { withStyles } from "@material-ui/core/styles";

import { Typography } from "@material-ui/core";

const cartStyles = theme => ({});

class _Cart extends Component {
  render() {
    return (
      <Fragment>
        <Navbar />
        <Typography>My Cart</Typography>
      </Fragment>
    );
  }
}

export const Cart = withStyles(cartStyles)(_Cart);
