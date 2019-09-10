import React, { Component, Fragment } from "react";

import { Navbar } from "./utils";

export class Products extends Component {
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
    return (
      <Fragment>
        <Navbar />
        <div className="products-section">
          {this.state.products.map(product => (
            <span key={product.id} className="product-images">
              <span>
                <img className="image" src={product.image} />
              </span>
              <span className="order">{product.name}</span>
            </span>
          ))}
        </div>
      </Fragment>
    );
  }
}
