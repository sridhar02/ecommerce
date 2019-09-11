import React, { Component, Fragment } from "react";

import { Navbar } from "./utils";
import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const productStyles = theme => ({
  productName: {
    height: theme.spacing(4.5)
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
        <div className="product-section">
          {this.state.products.map(product => (
            <div key={product.id} className="product-images">
              <span>
                <img className="image" src={product.image} />
              </span>
              <span className="order" className={classes.productName}>
                {product.name}
              </span>
              <Button variant="contained" color="primary">
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

export const Products = withStyles(productStyles)(_Products);
