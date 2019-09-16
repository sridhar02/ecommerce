import React, { Component, Fragment } from "react";
// import logo from "./logo.png";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
// import logo from "./logo.svg";
import "./App.css";

import { Products } from "./ProductsPage";
import { User } from "./UserPage";
import { Cart } from "./cartPage";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/sign_up" component={Signup} />
            <Route path="/products" render={() => <Products dark={true} />} />
            <Route path="/account" component={User} />
            <Route path="/viewcart" component={Cart} />
            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}

export default App;
