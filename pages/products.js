import React, { Component, Fragment } from "react";

import fetch from "isomorphic-unfetch";

import { Navbar } from "../src/utils";
import { withStyles } from "@material-ui/core/styles";

import { Button, Typography } from "@material-ui/core";

import Link from "next/link";

const productStyles = theme => ({
  name: {
    marginTop: theme.spacing(0.5),
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

class _Product extends Component {
  constructor(props) {
    super(props);
  }

  handleCart = event => {
    const { product } = this.props;
    event.preventDefault();
    fetch(`${process.env.API_URL}/cart`, {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      },
      body: JSON.stringify({
        product_id: product.id
      })
    }).then(response => {
      if (response.status === 201) {
      }
    });
    this.props.fetchProducts();
  };

  render() {
    // FIXME ssr html does not match intial react render on browser if user is logged in
    let addCart;
    const { classes, product, cartProducts } = this.props;
    if (cartProducts.some(cartProduct => product.id === cartProduct.id)) {
      addCart = (
        <Link href="/viewcart">
          <Button color="primary" variant="contained">
            GO TO CART
          </Button>
        </Link>
      );
    } else if (
      typeof window !== "undefined" &&
      localStorage.getItem("secret")
    ) {
      addCart = (
        <Button variant="contained" color="primary" onClick={this.handleCart}>
          Add to Cart
        </Button>
      );
    }

    return (
      <div className={classes.product}>
        <div>
          <img className={classes.image} src={product.image} />
        </div>
        <Typography variant="body2" className={classes.name}>
          {product.name}
        </Typography>
        <Typography variant="body2" className={classes.name}>
          ₹{product.price}
        </Typography>
        {addCart}
      </div>
    );
  }
}

const Product = withStyles(productStyles)(_Product);

const productsStyles = theme => ({
  section: {
    margin: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
  }
});

class _Products extends Component {
  static getInitialProps = async () => {
    const res = await fetch(`${process.env.API_URL}/products`);
    const products = await res.json();
    return { products };
  };

  constructor(props) {
    super(props);
    this.state = {
      products: props.products || [],
      cartProducts: props.cartProducts || []
    };
  }

  componentDidMount() {
    this.fetchProducts();
    fetch(`${process.env.API_URL}/cart`, {
      method: "GET",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      }
    })
      .then(response => response.json())
      .then(cartProducts => {
        this.setState({
          cartProducts: cartProducts
        });
      });
  }
  fetchProducts = () => {
    fetch(`${process.env.API_URL}/products`)
      .then(res => res.json())
      .then(products => {
        this.setState({
          products: products
        });
      });
  };
  render() {
    const { classes } = this.props;
    const { cartProducts } = this.state;
    return (
      <Fragment>
        <Navbar />
        <div className={classes.section}>
          {this.state.products.map(product => (
            <Product
              product={product}
              key={product.id}
              cartProducts={cartProducts}
              fetchProducts={this.fetchProducts}
            />
          ))}
        </div>
      </Fragment>
    );
  }
}

const Products = withStyles(productsStyles)(_Products);

export default Products;
