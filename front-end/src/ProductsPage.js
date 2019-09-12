import React, { Component, Fragment } from "react";

import { Navbar } from "./utils";
import { withStyles } from "@material-ui/core/styles";

import { Button, Typography } from "@material-ui/core";

const productStyles = theme => ({
  name: {
    height: theme.spacing(4.5),
    display: "flex",
    marginLeft: "10px",
    maxWidth: "120px"
  },
  product: {
    // marginLeft: "10px",
    marginBottom: "15px"
  },
  image: {
    margin: "10px",
    height: "100px",
    width: "120px"
  }
});

class _Product extends Component {
  handleCart = event => {
    event.preventDefault();
    fetch("http://localhost:8000/viewcart", {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 201) {
      }
    });
  };

  render() {
    const { classes, product } = this.props;
    return (
      <div className={classes.product}>
        <div>
          <img className={classes.image} src={product.image} />
        </div>
        <Typography variant="h7" className={classes.name}>
          {product.name}
        </Typography>
        <Button variant="contained" color="primary" onClick={this.handleCart}>
          Add to Cart
        </Button>
      </div>
    );
  }
}

const Product = withStyles(productStyles)(_Product);

const productsStyles = theme => ({
  productsSection: {
    margin: "20px 0px 20px 20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    gridTemplateRows: " 1fr "
  }
});

class _Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }
  componentDidMount() {
    fetch("http://localhost:8000/products")
      .then(res => res.json())
      .then(products => {
        this.setState({
          products: products
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        <div className={classes.productsSection}>
          {this.state.products.map(product => (
            <Product product={product} key={product.id} />
          ))}
        </div>
      </Fragment>
    );
  }
}

export const Products = withStyles(productsStyles)(_Products);
