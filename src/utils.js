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
    padding: theme.spacing(1),
    // margin: "0 10px",
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
    maxWidth: "546px",
    padding: "0px 20px",
    // borderRadius: "3px",
  },
  login: {
    color: "white",
  },
  root: {
    display: "flex",
    // height: "60px",
  },
  rightButtons: {
    margin: "0 10px",
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
  const timeOutId = useRef("");
  // const anchorEl = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    console.log("handleMouse Enter");
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    console.log("Handle Mouse Leave");
    timeOutId.current = setTimeout(() => {
      setAnchorEl(null);
      setOpen(false);
    }, 100);
  };

  const handlePopoverEnter = () => {
    console.log("Handle popover Enter");
    if (anchorEl) {
      clearTimeout(timeOutId.current);
    }
  };

  return (
    <div>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onClick={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={classes.user}
        // style={{ border: "1px solid black", padding: "10px", margin: "20px" }}
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
      >
        <div
          onMouseOver={handlePopoverEnter}
          style={{ padding: "10px", margin: "20px", border: "1px solid red" }}
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
        </div>
      </Popover>
    </div>
  );
}

function _Navbar({ classes, search, setSearch }) {
  // const [anchorEl, setAnchorEl] = useState(null);
  // const open = Boolean(anchorEl);

  const onSignout = () => {
    localStorage.removeItem("secret");
    Router.push("/login");
  };

  let authorized;
  let iconAuthorized;
  if (typeof window !== "undefined" && localStorage.getItem("secret")) {
    authorized = (
      <div className="d-none d-md-block col-md-6" className={classes.root}>
        <MouseOverPopover name={"username"} className={classes.rightButtons} />
        <Link href="/viewcart">
          <Button color="inherit" className={classes.rightButtons}>
            <ShoppingCart />
            CART
          </Button>
        </Link>
        <Button
          color="inherit"
          onClick={onSignout}
          className={classes.rightButtons}
        >
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
        <NavbarNew
          classes={classes}
          search={search}
          setSearch={setSearch}
          authorized={authorized}
        />
      </AppBar>
    </div>
  );
}

function NavbarNew({ classes, search, setSearch, authorized }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        margin: "0 400px",
      }}
    >
      <div style={{ display: "flex", flexGrow: 1 }}>
        <Link href="/products">
          <img className={classes.flipkart} src="/static/logo.png" />
        </Link>
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
