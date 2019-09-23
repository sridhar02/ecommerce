import React, { Component, Fragment } from "react";

import { Navbar } from "../src/utils";

import Link from "next/link";

import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

const productStyles = theme => ({
  name: {
    height: theme.spacing(4.5),
    display: "flex",
    marginLeft: "10px",
    maxWidth: "120px"
  },
  product: {
    // display: "flex",
    // margin: "15px"
  },
  image: {
    margin: "10px",
    height: "100px",
    width: "120px"
  }
});

function _Product({ classes, product }) {
  return (
    <div className={classes.product}>
      <div>
        <img className={classes.image} src={product.image} />
      </div>
      <Typography variant="body2" className={classes.name}>
        {product.name}
      </Typography>
      <Typography variant="body2">₹{product.price}</Typography>
    </div>
  );
}

const Product = withStyles(productStyles)(_Product);

const orderstyles = theme => ({
  orderDetails: {
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(20),
    display: "flex",
    justifyContent: "space-between"
  }
});
function _Order({ classes, order }) {
  return (
    <div>
      <div className={classes.orderDetails}>
        <Typography>{order.id}</Typography>
        <Typography>{order.created_at}</Typography>
      </div>
      {order.products.map(product => (
        <Product product={product} key={product.id} />
      ))}
    </div>
  );
}

const Order = withStyles(orderstyles)(_Order);

const ordersStyles = theme => ({
  mainsection:{
    backgroundColor:
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
    fetch("http://localhost:8000/orders", {
      method: "GET",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      }
    })
      .then(res => res.json())
      .then(orders => {
        this.setState({
          orders: orders
        });
      });
  }
  render() {
    return (
      <div className={classes.mainsection}>
        <Navbar />
        <Typography variant="h6">My Orders</Typography>
        {this.state.orders.map(order => (
          <Order order={order} key={order.id} />
        ))}
      </div>
    );
  }
}

const Orders = withStyles(ordersStyles)(_Orders);

export default Orders;
