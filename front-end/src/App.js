import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class Login extends Component {
  render() {
    return (
      <div class="main-section">
        <div class="side-bar">
          <span class="login">Login</span>
          <p class="display-text">
            <span>Get access to your Orders, Wishlist and Recommendations</span>
          </p>
        </div>
        <div class="login-layout">
          <input
            type="text"
            placeholder="Enter Email/Mobile Number"
            class="login-text"
          />
          <input
            type="password"
            placeholder="Enter password"
            class="password"
          />
          <button class="login-button">Login</button>
          <div class="space">
            <a class="create-account" href="#">
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
      <div>
        <input type="text" placeholder="Enter your username" />
        <input type="text" placeholder="Email" />
        <input placeholder="Enter your phone number" />
        <input type="password" placeholder="Enter your password" />
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
