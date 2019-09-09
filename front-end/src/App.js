import React, { Component } from "react";
import logo from "./logo.png";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
// import logo from "./logo.svg";
import "./App.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      signin: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch("http://localhost:8000/user/sign_in", {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    }).then(response => {
      if (response.status === 201) {
        this.setState({
          signin: true
        });
      }
    });
  };
  render() {
    if (this.state.signin) {
      return <Redirect to="/products" />;
    }
    return (
      <div className="main-section">
        <div className="side-bar">
          <span className="login">Login</span>
          <p className="display-text">
            <span>Get access to your Orders, Wishlist and Recommendations</span>
          </p>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="login-layout">
            <input
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Enter Email/Mobile Number"
              className="login-text"
            />
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Enter password"
              className="password"
            />
            <button className="login-button">Login</button>
            <div className="space">
              <Link className="create-account" to="/sign_up">
                New to Flipkart? Create an account
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      phonenumber: "",
      password: "",
      signup: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch("http://localhost:8000/user/signup", {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        phonenumber: this.state.phonenumber,
        password: this.state.password
      })
    }).then(response => {
      if (response.status === 201) {
        this.setState({
          signup: true
        });
      }
    });
  };

  render() {
    if (this.state.signup) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="main-section">
        <div className="side-bar">
          <span className="signup">Signup</span>
          <p className="display-text">
            <span>Get access to your Orders, Wishlist and Recommendations</span>
          </p>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="signup-layout">
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={this.state.username}
              onChange={this.handleChange}
              className="login-text"
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
              className="text"
            />
            <input
              name="phonenumber"
              placeholder="Enter your phone number"
              value={this.state.phonenumber}
              onChange={this.handleChange}
              className="text"
            />
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={this.state.password}
              onChange={this.handleChange}
              className="text"
            />
            <button className="signup-button" value="submit">
              Continue
            </button>
            <div className="space1">
              <Link className="create-account" to="/login">
                Existing account/login
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class Products extends Component {
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
      <div>
        <nav className="nav-bar">
          <span className="flipkart">Flipkart</span>
          <input className="search-input" placeholder="Search products" />
          <button className="button">
            <Link>USER</Link>
          </button>
          <button className="button">CART</button>
          <button className="button">sign-out</button>
        </nav>
        <div className="products-section">
          <span>
            {this.state.products.map(product => (
              <span className="product-images">
                <span>
                  <img className="image" src={product.image} />
                </span>
                <span key={product.name} className="order">
                  {product.name}
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/sign_up" component={Signup} />
            <Route path="/products" render={() => <Products dark={true} />} />
            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
