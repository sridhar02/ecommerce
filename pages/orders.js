import React, { Component, Fragment } from "react";

import { Navbar, authHeaders } from "../src/utils";

import Link from "next/link";

import Router, { withRouter } from "next/router";

import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

import axios from "axios";

import cx from "classnames";

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
    <Fragment>
      <div className={cx(classes.productDetails, "col - 6")}>
        <Typography variant="body2" className={classes.name}>
          {product.name}
        </Typography>
      </div>
      <div className="col-6">
        <img className={classes.image} src={product.image} />
      </div>
    </Fragment>
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
    border: "1px solid #eceff1"
    // margin: "20px"
  }
});
function _Order({ classes, order }) {
  let sum = 0;
  for (let product of order.products) {
    sum += product.price * product.quantity;
  }
  return (
    <div className={cx(classes.productSection, "row")}>
      {order.products.map(product => (
        <Product product={product} key={product.id} />
      ))}
      {/*<Typography variant="h6"> Order Total :₹{sum}</Typography>*/}
    </div>
  );
}

const Order = withStyles(orderstyles)(_Order);

const ordersStyles = theme => ({
  section: {
    // backgroundColor: "#eceff1"
  },
  mainSection: {},
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
    axios
      .get("/orders", authHeaders())
      .then(response =>
        this.setState({
          orders: response.data
        })
      )
      .catch(error => {
        Router.push("/login");
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        <div className={cx(classes.section, "container")}>
          <div className="row">
            <div className="col">
              <Typography variant="h6" className={classes.title}>
                My Account > My Orders
              </Typography>
            </div>
          </div>
          {this.state.orders.map(order => (
            <Order order={order} key={order.id} />
          ))}
        </div>
      </Fragment>
    );
  }
}

const Orders = withStyles(ordersStyles)(_Orders);

export default Orders;
