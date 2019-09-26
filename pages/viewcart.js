import React, { Component, Fragment } from "react";

import { Navbar } from "../src/utils";

import Link from "next/link";

import Router, { withRouter } from "next/router";

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
  }
});

class _Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleIncrement = event => {
    this.setState({
      quantity: this.state.quantity + 1
    });
  };

  handleDecrement = event => {
    if (this.state.quantity === 1) {
    } else {
      this.setState({
        quantity: this.state.quantity - 1
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch(`${process.env.API_URL}/cart`, {
      method: "PUT",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      },
      body: JSON.stringify({
        prouct_id: this.props.product.id,
        quantity: this.state.quantity
      })
    });
  };

  render() {
    const { classes, product } = this.props;
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
        <form onSubmit={this.handleSubmit}>
          <div>
            <Button onClick={this.handleDecrement}>-</Button>
            <span className={classes.textField} name="quantity">
              {this.state.quantity}
            </span>
            <Button
              onClick={this.handleIncrement}
              onChange={this.handleChange}
              type="submit"
            >
              +
            </Button>
          </div>
        </form>
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
    alignItems: "center"
  },
  section: {
    display: "flex",
    backgroundColor: "#eceff1"
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
    fetch(`${process.env.API_URL}/cart`, {
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
    fetch(`${process.env.API_URL}/orders`, {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      }
    }).then(response => {
      if (response.status === 201) {
        Router.push("/orders");
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
        <div className={classes.section}>
          <div className={classes.mainSection}>
            <Typography className={classes.mycart}>My Cart</Typography>
            <div>
              {this.state.products.map(product => (
                <Product product={product} key={product.id} />
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
            <Typography variant="h6">PRICE DETAILS</Typography>
          </div>
        </div>
      </Fragment>
    );
  }
}

const Cart = withStyles(cartStyles)(_Cart);

export default Cart;
