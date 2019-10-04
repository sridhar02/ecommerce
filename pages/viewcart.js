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
    width: "72px"
  },
  textField: {
    paddingTop: theme.spacing(1),
    backgroundColor: "white",
    borderRadius: "2px",
    borderTop: "1px solid #ccc"
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
      <Fragment className={classes.productSection}>
        <div className={cx(classes.textField, "row")}>
          <div className={cx(classes.product, "col-6")}>
            <Typography>{product.name}</Typography>
          </div>
          <div className="col offset-2 ">
            <img src={product.image} className={classes.image} />
          </div>
        </div>
        <div
          className={cx(classes.productDetails, "row justify-content-between")}
        >
          <div className="col-6">
            <Typography variant="h6">
              ₹{product.price * product.quantity}
            </Typography>
          </div>
          <span className={cx(classes.border, "col-3  ")}>
            Qty:{this.state.quantity}
          </span>
        </div>
        <div className={cx(classes.quantity, "row ")}>
          <div className="col-1 offset-8">
            <IconButton
              onClick={this.handleDecrement}
              disabled={quantity === 1}
            >
              <RemoveIcon />
            </IconButton>
          </div>
          <div className="col-1">
            <IconButton onClick={this.handleIncrement}>
              <AddIcon />
            </IconButton>
          </div>
        </div>
      </Fragment>
    );
  }
}
const Product = withStyles(productStyles)(_Product);

const priceStyles = theme => ({
  price: {
    // display: "flex",
    // padding: theme.spacing(1),
    // justifyContent: "space-between"
  },
  priceDetails: {
    // textAlign: "center",
  },
  delivery: {
    // display: "flex",
    // padding: theme.spacing(1),
    // justifyContent: "space-between",
    // borderBottom: "1px solid #eceff1"
  },
  alignment: {
    borderTop: "1px solid #eceff1",
    marginBottom: theme.spacing(1),
    backgroundColor: "white"
    // display: "flex",
    // justifyContent: "space-between"
  }
});

class _Price extends Component {
  render() {
    const { classes, products, sum } = this.props;
    return (
      <Fragment>
        <div className={cx(classes.alignment, "col")}>
          <div className={cx(classes.priceDetails, "row")}>
            <div className="col">PRICE DETAILS</div>
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
      </Fragment>
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
          <div className="row">{<Price products={products} sum={sum} />}</div>
          <div className={(classes.grandTotal, "row justify-content-between")}>
            <div className="col">
              <Typography variant="h6"> ₹{sum}</Typography>
            </div>
            <div className="col">
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
      </Fragment>
    );
  }
}

const Cart = withStyles(cartStyles)(_Cart);

export default Cart;
