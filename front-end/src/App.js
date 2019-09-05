import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

class Login extends Component {
  render() {
    return (
      <div className="main-section">
        <div className="side-bar">
          <span className="login">Login</span>
          <p className="display-text">
            <span>Get access to your Orders, Wishlist and Recommendations</span>
          </p>
        </div>
        <div className="login-layout">
          <input
            type="text"
            placeholder="Enter Email/Mobile Number"
            className="login-text"
          />
          <input
            type="password"
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
      </div>
    );
  }
}

class Signup extends Component {
  render() {
    return (
      <div className="main-section">
        <div className="side-bar">
          <span className="signup">Signup</span>
          <p className="display-text">
            <span>Get access to your Orders, Wishlist and Recommendations</span>
          </p>
        </div>
        <div className="signup-layout">
          <input
            type="text"
            placeholder="Enter your username"
            className="login-text"
          />
          <input type="text" placeholder="Email" className="text" />
          <input placeholder="Enter your phone number" className="text" />
          <input
            type="password"
            placeholder="Enter your password"
            className="text"
          />
          <button className="signup-button">Continue</button>
          <div className="space1">
            <Link className="create-account" to="/login">
              Existing account/login
            </Link>
          </div>
        </div>
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
        <ul>
          {this.state.products.map(product => (
            <li key={product.name} className="order">
              {product.name}
            </li>
          ))}
        </ul>
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
