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
    marginBottom: "15px"
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
    </div>
  );
}

const Product = withStyles(productStyles)(_Product);

function Order({ order }) {
  return (
    <div>
      <Typography>{order.id}</Typography>
      <Typography>{order.created_at}</Typography>
      {order.products.map(product => (
        <Product product={product} key={product.id} />
      ))}
    </div>
  );
}

const ordersStyles = theme => ({});

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
      <div>
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
