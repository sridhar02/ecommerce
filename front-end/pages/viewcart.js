import React, { Component, Fragment } from "react";

import { Navbar } from "../src/utils";

import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

const cartStyles = theme => ({
  mycart: {
    fontSize: "18px",
    lineHeight: "56px",
    padding: "0 24px",
    fontWeight: "500"
  },
  image: {
    textAlign: "center",
    padding: "30px 0 36px",
    background: "#fff"
  }
});

class _Cart extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        <Typography className={classes.mycart}>My Cart</Typography>
        <div className={classes.image}>
          <img src="/static/cart.png" />
          <div>
            <Button variant="contained" color="primary">
              SHOP KNOW
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

const Cart = withStyles(cartStyles)(_Cart);

export default Cart;
