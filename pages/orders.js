import React, { Component, Fragment } from "react";

import { Navbar, authHeaders } from "../src/utils";

import Link from "next/link";

import Router, { withRouter } from "next/router";

import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

import axios from "axios";

import cx from "classnames";

const productStyles = theme => ({
  name: {},
  product: {
    margin: theme.spacing(1)
  },
  image: {
    height: "72px",
    width: "72px"
  },
  productDetails: {}
});

function _Product({ classes, product }) {
  return (
    <div className={cx(classes.product, "row")}>
      <div className={cx(classes.productDetails, "col-8")}>
        <Typography variant="body2" className={classes.name}>
          {product.name}
        </Typography>
        <Typography variant="body2" className={classes.name}>
          Qty: {product.quantity}
        </Typography>
        <Typography variant="body2" className={classes.name}>
          Price: {product.price * product.quantity}
        </Typography>
      </div>
      <div className="col-4">
        <img className={classes.image} src={product.image} />
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
    margin: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(2)
    }
  },
  total: {
    marginLeft: theme.spacing(2.5),
    fontWeight: "bold"
  }
});
function _Order({ classes, order }) {
  let sum = 0;
  for (let product of order.products) {
    sum += product.price * product.quantity;
  }
  return (
    <div className={cx(classes.productSection, "row")}>
      <div className="col">
        {order.products.map(product => (
          <Product product={product} key={product.id} />
        ))}
        <Typography variant="body1" className={classes.total}>
          Order Total :₹{sum}
        </Typography>
      </div>
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
              {this.state.orders.map(order => (
                <Order order={order} key={order.id} />
              ))}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const Orders = withStyles(ordersStyles)(_Orders);

export default Orders;
