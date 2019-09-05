import React, { Component } from "react";
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
            <a
              className="create-account"
              href="#"
              onClick={this.props.showSignup}
            >
              New to Flipkart? Create an account
            </a>
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
            <a class="create-account" href="#" onClick={this.props.showLogin}>
              Existing account/login
            </a>
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
    const products = this.state.products.map(product => <li>{product}</li>);
    return (
      <div>
        <ul>
          <li>{products.name}</li>
        </ul>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Login"
    };
  }

  showLogin = () => {
    this.setState({
      screen: "Login"
    });
  };

  showSignup = () => {
    this.setState({
      screen: "Signup"
    });
  };

  render() {
    return (
      <div>
        {/*{this.state.screen === "Login" ? (
          <Login showSignup={this.showSignup} />
        ) : (
          <Signup showLogin={this.showLogin} />
        )}*/}
        <Products />
      </div>
    );
  }
}

export default App;
