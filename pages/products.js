import React, { Component, Fragment } from "react";
import Link from "next/link";
import axios from "axios";
import matchSorter from "match-sorter";

import { Navbar, authHeaders } from "../src/utils";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const productStyles = (theme) => ({
  name: {
    marginTop: theme.spacing(0.5),
    height: theme.spacing(4.5),
    display: "flex",
    marginLeft: "10px",
    maxWidth: "120px",
  },
  product: {
    marginBottom: "15px",
  },
  image: {
    margin: "10px",
    height: "200px",
    width: "220px",
  },
});

const images = ["/static/flip1.png", "/static/flip2.png", "/static/flip3.png"];
let slides = [1, 2, 3, 4, 5];
function SliderImages() {
  const [X, setX] = React.useState(0);
  const goLeft = () => {
    X === 0 ? setX(-100 * (images.length - 1)) : setX(X + 100);
  };
  const goRight = () => {
    X === -100 * (images.length - 1) ? setX(0) : setX(X - 100);
  };
  return (
    <div
      style={{
        border: "1px solid red",
        width: "100%",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow:"hidden"
      }}
    >
      {images.map((slide, index) => (
        <img
          src={slide}
          key={index}
          style={{
            border: "1px solid blue",
            minWidth: "100%",
            height: "250px",
            // width: "1750px",
            // height: "80vh",
            position: "relative",
            transform: `translateX(${X}%)`,
            transition: ".5s",
            overflow:"hidden" 
          }}
        />
      ))}
      <Button
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: `translateY(-50%)`,
          height: "80%",
          color:"#fff",
          
        }}
        onClick={goLeft}
      >
        <ChevronLeftIcon style={{fontSize: "50px"}} />
      </Button>
      <Button
        onClick={goRight}
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: `translateY(-50%)`,
          height: "80%",
          color:"#fff",
          // fontSize: "50px"
        }}
      >
        <ChevronRightIcon style={{fontSize: "50px"}}/>
      </Button>
    </div>
  );
}

class _Product extends Component {
  handleCart = (event) => {
    const { product } = this.props;
    event.preventDefault();
    axios
      .post("/cart", { product_id: product.id }, authHeaders())
      .then(() => this.props.fetchCart())
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    // FIXME ssr html does not match intial react render on browser if user is logged in
    let addCart;
    const { classes, product, cartProducts } = this.props;
    if (cartProducts.some((cartProduct) => product.id === cartProduct.id)) {
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

const productsStyles = (theme) => ({
  section: {
    margin: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  },
});

class _Products extends Component {
  static getInitialProps = async () => {
    const res = await axios.get("/products");
    const products = res.data;
    return { products };
  };

  constructor(props) {
    super(props);
    this.state = {
      products: props.products || [],
      cartProducts: props.cartProducts || [],
      search: "",
    };
  }

  componentDidMount() {
    axios
      .get("/products")
      .then((response) => this.setState({ products: response.data }))
      .catch((error) => {
        console.log(error);
      });

    if (localStorage.getItem("secret")) {
      this.fetchCart();
    }
  }
  fetchCart = () => {
    axios
      .get("/cart", authHeaders())
      .then((response) => {
        this.setState({ cartProducts: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  setSearch = (event) => {
    this.setState({
      search: event.target.value,
    });
  };
  render() {
    const { classes } = this.props;
    const { cartProducts, products, search } = this.state;
    let filteredProducts = matchSorter(products, search, { keys: ["name"] });
    return (
      <Fragment>
        <Navbar search={search} setSearch={this.setSearch} />
        <SliderImages />
        <div className={classes.section}>
          {filteredProducts.map((product) => (
            <Product
              product={product}
              key={product.id}
              cartProducts={cartProducts}
              fetchCart={this.fetchCart}
            />
          ))}
        </div>
      </Fragment>
    );
  }
}

const Products = withStyles(productsStyles)(_Products);

export default Products;
