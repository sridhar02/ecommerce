import React, { Component, Fragment } from "react";

import { Navbar } from "../src/utils";

import Link from "next/link";

import Router, { withRouter } from "next/router";

import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

const productStyles = theme => ({
  name: {
    height: theme.spacing(4.5),
    display: "flex",
    maxWidth: "120px"
  },
  product: {
    display: "flex"
  },
  image: {
    margin: "10px",
    height: "100px",
    width: "120px"
  },
  productDetails: {
    margin: "10px",
    display: "flex",
    flexDirection: "column"
  }
});

function _Product({ classes, product }) {
  return (
    <div className={classes.product}>
      <div>
        <img className={classes.image} src={product.image} />
      </div>
      <div className={classes.productDetails}>
        <Typography variant="body2" className={classes.name}>
          {product.name}
        </Typography>
        <Typography variant="body2">₹{product.price}</Typography>
        <Typography variant="body2">Quantity:{product.quantity}</Typography>
      </div>
    </div>
  );
}

const Product = withStyles(productStyles)(_Product);

const orderstyles = theme => ({
  orderDetails: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eceff1",
    backgroundColor: "#eceff1",
    padding: "10px"
  },
  productSection: {
    border: "1px solid #eceff1",
    margin: "20px"
  }
});
function _Order({ classes, order }) {
  return (
    <div className={classes.productSection}>
      <div className={classes.orderDetails}>
        <Typography>Order Number: {order.id}</Typography>
        <Typography> Ordered On: {order.created_at}</Typography>
      </div>
      {order.products.map(product => (
        <Product product={product} key={product.id} />
      ))}
    </div>
  );
}

const Order = withStyles(orderstyles)(_Order);

const ordersStyles = theme => ({
  section: {
    backgroundColor: "#eceff1"
  },
  mainSection: {
    margin: "0px 40px",
    border: "1px solid #ccc",
    backgroundColor: "white"
  },
  title: {
    margin: "25px"
  }
});

class _Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: props.orders || []
    };
  }
  componentDidMount() {
    fetch(`${process.env.API_URL}/orders`, {
      method: "GET",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      }
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          return Router.push("/login");
        }
      })
      .then(orders => {
        this.setState({
          orders: orders
        });
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <Navbar />
        <div className={classes.mainSection}>
          <Typography variant="h6" className={classes.title}>
            My Account > My Orders
          </Typography>
          {this.state.orders.map(order => (
            <Order order={order} key={order.id} />
          ))}
        </div>
      </div>
    );
  }
}

const Orders = withStyles(ordersStyles)(_Orders);

export default Orders;
