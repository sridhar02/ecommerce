import React, { Component, Fragment } from "react";

import { Navbar } from "../src/utils";

import Link from "next/link";

import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

const emptyCartStyles = theme => ({
  image: {
    textAlign: "center",
    padding: "30px 0 36px",
    background: "#fff"
  },
  link: {
    textDecoration: "none",
    color: "white"
  },
  button: {
    textAlign: "center"
  }
});

function _EmptyCart(props) {
  const { classes } = props;
  return (
    <div>
      <Navbar />
      <Typography className={classes.mycart}>My Cart</Typography>
      <div className={classes.image}>
        <img src="/static/cart.png" />
      </div>
      <div className={classes.button}>
        <Button variant="contained" color="primary">
          <Link href="/products">
            <a className={classes.link}>SHOP KNOW</a>
          </Link>
        </Button>
      </div>
    </div>
  );
}

const EmptyCart = withStyles(emptyCartStyles)(_EmptyCart);

const productStyles = theme => ({
  image: {
    margin: "10px",
    height: "100px",
    width: "120px"
  }
});

function _Product({ classes, product }) {
  return (
    <div>
      <Typography variant="body2">{product.name}</Typography>
      <div>
        <img src={product.image} className={classes.image} />
      </div>
    </div>
  );
}

const Product = withStyles(productStyles)(_Product);

const cartStyles = theme => ({
  mycart: {
    fontSize: "18px",
    lineHeight: "56px",
    padding: "0 24px",
    fontWeight: "500"
  }
});

class _Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: props.products || []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/cart", {
      method: "GET",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      }
    })
      .then(res => res.json())
      .then(products => {
        this.setState({
          products: products
        });
      });
  }

  handleOrder = event => {
    event.preventDefault();
    fetch("http://localhost:8000/orders", {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      }
    }).then(response => {
      if (response.status === 201) {
        router.push("/orders");
      }
    });
  };

  render() {
    const { classes, products } = this.props;
    if (this.state.products.length === 0) {
      return <EmptyCart />;
    }
    return (
      <Fragment>
        <Navbar />
        <Typography className={classes.mycart}>My Cart</Typography>
        <div>
          {this.state.products.map(product => (
            <Product product={product} key={product.id} />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleOrder}
          >
            Buy products
          </Button>
        </div>
      </Fragment>
    );
  }
}

const Cart = withStyles(cartStyles)(_Cart);

export default Cart;
