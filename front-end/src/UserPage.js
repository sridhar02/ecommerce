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

const personalInformationStyles = theme => {
  console.log(theme);

  return {
    gender: {
      display: "flex",
      flexDirection: "row"
    },
    button: {
      margin: "10px"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  };
};

class _PersonalInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      disable: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch("http://localhost:8000/user", {
      method: "PUT",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name
      })
    }).then(response => {
      if (response.status === 204) {
        this.setState({
          disable: true
        });
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="h5">
          Personal information
          <Button color="primary" className={classes.button}>
            edit
          </Button>
        </Typography>
        <div>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="outlined-name"
              label="Name"
              name="name"
              className={classes.textField}
              placeholder="Enter Name"
              value={this.state.name}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
            />
          </form>
          <div className="gender">
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Your Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                className={classes.gender}
              >
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </Fragment>
    );
  }
}

const PersonalInformation = withStyles(personalInformationStyles)(
  _PersonalInformation
);

const emailStyles = {};

class _Email extends Component {
  render() {
    return (
      <Fragment>
        <div className="email-edit">
          <Typography variant="h5">Email Adresss</Typography>
          <Button color="primary">edit</Button>
          <Button color="primary">change password</Button>
        </div>
        <TextField
          id="outlined-name"
          label="Email"
          // className={classes.textField}
          placeholder=" Enter Email Adress"
          margin="normal"
          variant="outlined"
        />
      </Fragment>
    );
  }
}

const Email = withStyles(emailStyles)(_Email);

class Phonenumber extends Component {
  render() {
    return (
      <Fragment>
        <div className="Mobilenumber-edit">
          <Typography variant="h5">Mobile Number</Typography>
          <Button color="primary">edit</Button>
        </div>
        <TextField
          id="outlined-name"
          label="Phonenumber"
          // className={classes.textField}
          placeholder=" Enter Phonenumber"
          margin="normal"
          variant="outlined"
        />
      </Fragment>
    );
  }
}

function FAQS() {
  return (
    <Fragment>
      <Typography variant="h5">FAQs</Typography>
      <Typography>
        What happens when I update my email address (or mobile number)? Your
        login email id (or mobile number) changes, likewise. You'll receive all
        your account related communication on your updated email address (or
        mobile number).
      </Typography>
      <Typography>
        When will my Flipkart account be updated with the new email address (or
        mobile number)?It happens as soon as you confirm the verification code
        sent to your email (or mobile) and save the changes.
      </Typography>
      <br />
      <Typography>
        What happens to my existing Flipkart account when I update my email
        address (or mobile number)? Updating your email address (or mobile
        number) doesn't invalidate your account. Your account remains fully
        functional. You'll continue seeing your Order history, saved information
        and personal details.
      </Typography>
      <br />
      <Typography>
        Does my Seller account get affected when I update my email address?
        Flipkart has a 'single sign-on' policy. Any changes will reflect in your
        Seller account also.
      </Typography>
    </Fragment>
  );
}

export class User extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <Navbar />
        <div className="user-section">
          <div className="user-sidebar">
            <button>My orders</button>
          </div>
          <div className="user-information">
            <PersonalInformation />
            <Email />
            <Phonenumber />
            <FAQS />
          </div>
        </div>
      </Fragment>
    );
  }
}
