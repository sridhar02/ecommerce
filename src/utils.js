import React, { useState, useRef } from "react";
import Link from "next/link";
import Router from "next/router";

import Menu from "@material-ui/core/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Popover from "@material-ui/core/Popover";
import { withStyles } from "@material-ui/styles";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { Button, TextField, Typography } from "@material-ui/core";

import ShoppingCart from "@material-ui/icons/ShoppingCart";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Assignment from "@material-ui/icons/Assignment";
import ExitToApp from "@material-ui/icons/ExitToApp";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const navbarStyles = (theme) => ({
  button: {
    padding: theme.spacing(1.5),
    margin: "0 10px",
    fontWeight: "bold",
    fontSize: theme.spacing(2.5),
    color: "white",
  },
  flipkart: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(1),
    },
  },
  searchInput: {
    backgroundColor: "white",
    margin: "8px 0px",
    width: "100%",
    padding: "0px 20px",
    borderRadius: "3px",
    // width:"400px"
  },
  login: {
    color: "white",
  },
  root: {
    display: "flex",
  },
});

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
  user: {
    marginTop: "13px",
  },
}));

export default function MouseOverPopover({ name }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    console.log(typeof anchorEl);
    // if (anchorEl === null) {
    const settime = setTimeout(() => setAnchorEl(null), 500);
    // }
    console.log(settime);
  };

  const open = Boolean(anchorEl);
  console.log(anchorEl);
  return (
    <div>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={classes.user}
      >
        {name} {anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        // onEntered={handlePopoverOpen}
        // onClose={handlePopoverClose}
        disableRestoreFocus
        // onEnter={handlePopoverOpen}
      >
        <Link href="/account">
          <Typography>My Profile</Typography>
        </Link>
        <Typography>SuperCoin Zone </Typography>
        <Typography>Flipkart Plus Zone</Typography>
        <Link href="/orders">
          <Button color="inherit">ORDERS</Button>
        </Link>
        <Typography>Wishlist</Typography>
        <Typography>My Charts</Typography>

        <Typography>Coupons</Typography>
        <Typography>Gift Cards</Typography>
        <Typography>notifications</Typography>
        <div>
          <Button>SIGNOUT</Button>
        </div>
      </Popover>
    </div>
  );
}

function _Navbar({ classes, search, setSearch }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const onSignout = () => {
    localStorage.removeItem("secret");
    Router.push("/login");
  };

  let authorized;
  let iconAuthorized;
  if (typeof window !== "undefined" && localStorage.getItem("secret")) {
    authorized = (
      <div className="d-none d-md-block col-md-6" className={classes.root}>
        <MouseOverPopover name={"username"} />
        <Link href="/viewcart">
          <Button color="inherit">
            <ShoppingCart />
            CART
          </Button>
        </Link>
        <Button color="inherit" onClick={onSignout}>
          SIGNOUT
        </Button>
      </div>
    );
    iconAuthorized = (
      <span className="d-md-none">
        <Link href="/account">
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Link>
        <Link href="/viewcart">
          <IconButton color="inherit">
            <ShoppingCart />
          </IconButton>
        </Link>
        <Link href="/orders">
          <IconButton color="inherit">
            <Assignment />
          </IconButton>
        </Link>
        <IconButton color="inherit">
          <ExitToApp />
        </IconButton>
      </span>
    );
  } else {
    authorized = (
      <div>
        <Link href="/login">
          <Button className={classes.login}>login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <div className="container">
          <div className="row">
            <div className="col-4 col-md-2">
              <Link href="/products">
                <img className={classes.flipkart} src="/static/logo.png" />
              </Link>{" "}
            </div>
            {iconAuthorized}
            <div className="col-12 col-md-4">
              <InputBase
                id="outlined-bare"
                variant="outlined"
                inputProps={{ "aria-label": "bare" }}
                className={classes.searchInput}
                placeholder="Search products"
                value={search}
                onChange={setSearch}
                endAdornment={<SearchIcon />}
              />
            </div>
            {authorized}
          </div>
        </div>
      </AppBar>
    </div>
  );
}

export const Navbar = withStyles(navbarStyles)(_Navbar);

export function authHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("secret")}`,
    },
  };
}
