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
    margin: "10px",
    height: "100px",
    marginLeft: "30px",
    width: "120px"
  },
  productDetails: {
    display: "flex",
    flexDirection: "column",
    margin: "10px 10px 10px 10px "
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "15px",
    padding: "5px",
    borderRadius: "2px",
    border: "1px solid #ccc"
  },
  productView: {
    display: "flex"
  },
  icons: {
    marginLeft: "20px"
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
      <div>
        <div className={classes.productView}>
          <div>
            <img src={product.image} className={classes.image} />
          </div>
          <div className={classes.productDetails}>
            <Typography>{product.name}</Typography>
            <Typography variant="body2">₹{product.price} </Typography>
          </div>
        </div>
        <div className={classes.icons}>
          <IconButton onClick={this.handleDecrement} disabled={quantity === 1}>
            <RemoveIcon />
          </IconButton>
          <span className={classes.textField}>{this.state.quantity}</span>
          <IconButton onClick={this.handleIncrement}>
            <AddIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}
const Product = withStyles(productStyles)(_Product);

const cartStyles = theme => ({
  mycart: {
    fontSize: "18px",
    lineHeight: "56px",
    padding: "0 24px",
    fontWeight: "500"
  },
  mainSection: {
    margin: theme.spacing(2),
    minWidth: "800px",
    margin: "20px auto",
    border: "1px solid #ccc",
    backgroundColor: "white",
    padding: "10px"
  },
  placeOrder: {
    display: "flex",
    justifyContent: "flex-end"
  },
  sideSection: {
    border: "1px solid #ccc",
    minWidth: "400px",
    margin: "20px auto",
    marginRight: "60px",
    backgroundColor: "white",
    alignItems: "center",
    height: "200px"
  },
  section: {
    display: "flex",
    backgroundColor: "#eceff1"
  }
});

const priceStyles = theme => ({
  price: {
    display: "flex",
    padding: theme.spacing(1),
    justifyContent: "space-between"
  },
  priceDetails: {
    textAlign: "center",
    padding: theme.spacing(1),
    borderBottom: "1px solid #eceff1"
  },
  delivery: {
    display: "flex",
    padding: theme.spacing(1),
    justifyContent: "space-between",
    borderBottom: "1px solid #eceff1"
  },
  total: {
    display: "flex",
    padding: theme.spacing(1),
    justifyContent: "space-between"
  }
});

class _Price extends Component {
  render() {
    const { classes, products, sum } = this.props;
    return (
      <div>
        <Typography variant="h6" className={classes.priceDetails}>
          PRICE DETAILS
        </Typography>
        <div className={classes.price}>
          <div>Price ({products.length} items):</div>
          <div>{sum}</div>
        </div>
        <div className={classes.delivery}>
          <div>Delivery :</div>
          <div>Free</div>
        </div>
        <div className={classes.total}>
          <div>Total Payable:</div>
          <div>{sum}</div>
        </div>
      </div>
    );
  }
}

const Price = withStyles(priceStyles)(_Price);

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
        <div className={classes.section}>
          <div className={classes.mainSection}>
            <Typography className={classes.mycart}>My Cart</Typography>
            <div>
              {products.map(product => (
                <Product
                  product={product}
                  key={product.id}
                  fetchCart={this.fetchCart}
                />
              ))}
            </div>
            <div className={classes.placeOrder}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleOrder}
              >
                Place Order
              </Button>
            </div>
          </div>
          <div className={classes.sideSection}>
            <Price products={products} sum={sum} />
          </div>
        </div>
      </Fragment>
    );
  }
}

const Cart = withStyles(cartStyles)(_Cart);

export default Cart;
