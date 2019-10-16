import React, { Component, Fragment } from "react";

import { Navbar, authHeaders } from "../src/utils";

import Link from "next/link";

import fetch from "isomorphic-unfetch";

import Router, { withRouter } from "next/router";

import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import { Button, TextField, Typography } from "@material-ui/core";

import axios from "axios";

import cx from "classnames";

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
  },
  emptySection: {
    border: "1px solid #eceff1",
    margin: "20px",
    padding: "20px",
    backgroundColor: "white"
  }
});

function _EmptyCart(props) {
  const { classes } = props;
  return (
    <div>
      <Navbar />
      <div className={classes.emptySection}>
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
    </div>
  );
}

const EmptyCart = withStyles(emptyCartStyles)(_EmptyCart);

const productStyles = theme => ({
  image: {
    height: "72px",
    width: "100%"
  },
  textField: {
    [theme.breakpoints.down("md")]: {
      paddingTop: theme.spacing(1),
      backgroundColor: "white",
      borderRadius: "2px",
      borderTop: "1px solid #ccc"
    }
  },
  productSection: {
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      border: "1px solid #ccc"
    }
  },
  icons: {},
  productDetails: {
    paddingTop: theme.spacing(1),
    backgroundColor: "white"
  },
  quantity: {
    backgroundColor: "white",
    marginBottom: theme.spacing(1)
  },
  product: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "black"
  },
  icon: {
    height: 16,
    width: 16
  }
});

class _Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: props.product.quantity
    };
  }

  handleIncrement = event => {
    this.setState({
      quantity: this.state.quantity + 1
    });
    axios
      .put(
        "/cart",
        {
          product_id: this.props.product.id,
          quantity: this.state.quantity + 1
        },
        authHeaders()
      )
      .then(() => this.props.fetchCart())
      .catch(error => {
        console.log(error);
      });
  };

  handleDecrement = event => {
    if (this.state.quantity === 1) {
      return;
    }

    this.setState({
      quantity: this.state.quantity - 1
    });

    axios
      .put(
        "/cart",
        {
          product_id: this.props.product.id,
          quantity: this.state.quantity - 1
        },
        authHeaders()
      )
      .then(() => this.props.fetchCart());
  };

  render() {
    const { classes, product } = this.props;
    const { quantity } = this.state;
    return (
      <div className={classes.productSection}>
        <div className={cx(classes.textField, "row")}>
          <div className={cx(classes.product, "col-8 col-md-10")}>
            <Typography>{product.name}</Typography>
          </div>
          <div className="col-4 col-md-2">
            <img src={product.image} className={classes.image} />
          </div>
        </div>
        <div className={cx(classes.productDetails, "row")}>
          <span className={"col-8 col-md-10"}>
            <IconButton
              onClick={this.handleDecrement}
              disabled={quantity === 1}
            >
              <RemoveIcon className={classes.icon} />
            </IconButton>
            <span> Qty:{this.state.quantity}</span>
            <IconButton onClick={this.handleIncrement}>
              <AddIcon className={classes.icon} />
            </IconButton>
          </span>
          <div className="col-4 col-md-2 d-flex justify-content-center">
            <Typography variant="h6">
              ₹{product.price * product.quantity}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}
const Product = withStyles(productStyles)(_Product);

const priceStyles = theme => ({
  priceDetails: {
    [theme.breakpoints.up("md")]: {
      borderBottom: "1px solid #ccc",
      padding: theme.spacing(1.8),
      Color: "#878787"
    }
  },
  priceSection: {
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(5),
      border: "1px solid #ccc"
    }
  },
  delivery: {},
  alignment: {
    marginBottom: theme.spacing(1)
  }
});

class _Price extends Component {
  render() {
    const { classes, products, sum } = this.props;
    return (
      <div className={classes.priceSection}>
        <div className={cx(classes.alignment, "col")}>
          <div className="row">
            <div className={cx(classes.priceDetails, "col")}>PRICE DETAILS</div>
          </div>
          <div className={cx(classes.price, "row")}>
            <div className="col-6">Price ({products.length} items)</div>
            <div className="col-3 offset-3">{sum}</div>
            <div className="col-6">Delivery :</div>
            <div className="col-3 offset-3">Free</div>
          </div>
          <div className={cx(classes.total, "row")}>
            <div className="col-6">Total Payable:</div>
            <div className="col-3 offset-3">{sum}</div>
          </div>
        </div>
      </div>
    );
  }
}

const Price = withStyles(priceStyles)(_Price);

const cartStyles = theme => ({
  mycart: {
    margin: theme.spacing(1)
  },
  mainSection: {
    border: "1px solid #ccc",
    backgroundColor: "white"
  },
  placeOrder: {},
  sideSection: {
    border: "1px solid #ccc"
  },
  grandTotal: {
    border: "1px solid #ccc",
    margin: theme.spacing(1)
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
    this.fetchCart();
  }

  fetchCart = () => {
    axios
      .get("/cart", authHeaders())
      .then(response =>
        this.setState({
          products: response.data
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  handleOrder = event => {
    event.preventDefault();
    axios
      .post("/orders", {}, authHeaders())
      .then(() => Router.push("/orders"))
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { classes } = this.props;
    const { products } = this.state;
    if (products.length === 0) {
      return <EmptyCart />;
    }
    let sum = 0;
    for (let product of products) {
      sum += product.price * product.quantity;
    }
    return (
      <Fragment>
        <Navbar />
        <div className={cx(classes.section, "container")}>
          <div className="row">
            <div className="col-12 col-md-8">
              <div className="col">
                <Typography className={classes.mycart}>
                  My Cart ({products.length})
                </Typography>
                {products.map(product => (
                  <Product
                    product={product}
                    key={product.id}
                    fetchCart={this.fetchCart}
                  />
                ))}
              </div>
            </div>
            <div className="col-12 col-md-4">
              {<Price products={products} sum={sum} />}
            </div>
            <div className={(classes.grandTotal, "col-12 col-md-8")}>
              <div className="row">
                <div className="col-4 d-md-none">
                  <Typography variant="h6"> ₹{sum}</Typography>
                </div>
                <div className="col-8 col-md-12 d-flex justify-content-end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleOrder}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const Cart = withStyles(cartStyles)(_Cart);

export default Cart;
