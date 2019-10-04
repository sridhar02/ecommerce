import React, { Component, Fragment } from "react";

import { Navbar, authHeaders } from "../src/utils";

import Link from "next/link";

import { withStyles } from "@material-ui/core/styles";

import { Button, TextField, Typography } from "@material-ui/core";

import Radio from "@material-ui/core/Radio";

import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";

import FormControl from "@material-ui/core/FormControl";

import FormLabel from "@material-ui/core/FormLabel";

import axios from "axios";

const personalInformationStyles = theme => ({
  alignment: {
    display: "flex",
    paddingBottom: theme.spacing(1)
  },
  gender: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(2)
  },
  personalInformation: {
    display: "flex",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2)
  },
  spacing: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(7)
  },
  buttonMargin: {
    marginLeft: theme.spacing(2)
  },
  rightMargin: {
    marginRight: theme.spacing(4)
  }
});

class _PersonalInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      sex: "",
      disabled: true
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    axios
      .put(
        "/user",
        {
          name: this.state.name,
          sex: this.state.sex
        },
        authHeaders()
      )
      .then(() =>
        this.setState({
          disabled: true
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  handleEdit = () => {
    this.setState({
      disabled: false
    });
  };
  handleCancel = () => {
    this.setState({
      disabled: true
    });
  };

  render() {
    const { classes } = this.props;
    const { disabled } = this.state;
    let buttons;
    let saveButton;
    if (disabled === true) {
      buttons = (
        <Button color="primary" onClick={this.handleEdit}>
          edit
        </Button>
      );
    } else {
      buttons = (
        <Fragment>
          <Button color="primary" onClick={this.handleCancel}>
            Cancel
          </Button>{" "}
        </Fragment>
      );
      saveButton = (
        <Button
          variant="contained"
          className={classes.buttonMargin}
          color="primary"
          type="submit"
        >
          Save
        </Button>
      );
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={classes.personalInformation}>
          <Typography variant="h6">Personal information</Typography>
          {buttons}
        </div>
        <div>
          <div className={classes.alignment}>
            <TextField
              name="name"
              label="Name"
              placeholder="Enter Name"
              value={this.state.name}
              onChange={this.handleChange}
              disabled={disabled}
              variant="outlined"
            />
            {saveButton}
          </div>
          <div className={classes.gender} className={classes.spacing}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Your Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="sex"
                value={this.state.sex}
                onChange={this.handleChange}
                className={classes.gender}
              >
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  className={classes.rightMargin}
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
      </form>
    );
  }
}

const PersonalInformation = withStyles(personalInformationStyles)(
  _PersonalInformation
);

const emailStyles = theme => ({
  buttonMargin: {
    marginLeft: theme.spacing(2)
  },
  align: {
    display: "flex",
    marginBottom: theme.spacing(6)
  },
  emailEdit: {
    display: "flex",
    marginBottom: theme.spacing(3)
  }
});

class _Email extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      disabled: true
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    axios
      .put(
        "/user",
        {
          email: this.state.email
        },
        authHeaders()
      )
      .then(() =>
        this.setState({
          disabled: true
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  handleEdit = () => {
    this.setState({
      disabled: false
    });
  };

  handleCancel = () => {
    this.setState({
      disabled: true
    });
  };

  render() {
    const { classes } = this.props;
    const { disabled } = this.state;

    let buttons;
    let saveButton;
    if (disabled === true) {
      buttons = (
        <Fragment>
          <Button onClick={this.handleEdit} color="primary">
            edit
          </Button>
          <Button color="primary">change password</Button>
        </Fragment>
      );
    } else {
      buttons = (
        <Fragment>
          <Button color="primary" onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button color="primary">change password</Button>
        </Fragment>
      );
      saveButton = (
        <Button
          variant="contained"
          className={classes.buttonMargin}
          color="primary"
          type="submit"
        >
          Save
        </Button>
      );
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={classes.emailEdit}>
          <Typography variant="h6">Email Adresss</Typography>
          {buttons}
        </div>
        <div className={classes.align}>
          <TextField
            label="Email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            disabled={disabled}
            placeholder=" Enter Email Adress"
            variant="outlined"
          />
          {saveButton}
        </div>
      </form>
    );
  }
}

const Email = withStyles(emailStyles)(_Email);

const phoneNumberStyles = theme => ({
  buttonMargin: {
    marginLeft: theme.spacing(2)
  },
  align: {
    display: "flex",
    marginBottom: theme.spacing(6)
  },
  mobileNumberEdit: {
    display: "flex",
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(2)
  }
});

class _Phonenumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: "",
      disabled: true
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    axios
      .put(
        "http://localhost:8000/user",
        {
          phonenumber: this.state.phonenumber
        },
        authHeaders()
      )
      .then(() =>
        this.setState({
          disabled: true
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  handleEdit = () => {
    this.setState({
      disabled: false
    });
  };

  handleCancel = () => {
    this.setState({
      disabled: true
    });
  };
  render() {
    const { classes } = this.props;
    const { disabled } = this.state;
    let buttons;
    let saveButton;
    if (disabled === true) {
      buttons = (
        <Button color="primary" onClick={this.handleEdit}>
          edit
        </Button>
      );
    } else {
      buttons = (
        <Button color="primary" onClick={this.handleCancel}>
          Cancel
        </Button>
      );
      saveButton = (
        <Button
          variant="contained"
          className={classes.buttonMargin}
          color="primary"
          type="submit"
        >
          Save
        </Button>
      );
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={classes.mobileNumberEdit}>
          <Typography variant="h6">Mobile Number</Typography>
          {buttons}
        </div>
        <div className={classes.align}>
          <TextField
            name="phonenumber"
            value={this.state.phonenumber}
            onChange={this.handleChange}
            disabled={disabled}
            label="Phonenumber"
            variant="outlined"
            placeholder=" Enter Phonenumber"
          />
          {saveButton}
        </div>
      </form>
    );
  }
}

const Phonenumber = withStyles(phoneNumberStyles)(_Phonenumber);

function FAQS() {
  return (
    <Fragment>
      <Typography variant="h5">FAQs</Typography>
      <br />
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

const userStyles = theme => ({
  userInformation: {
    display: "flex",
    flexDirection: "column",
    minWidth: "700px",
    margin: "0 auto",
    marginLeft: "16px",
    padding: "24px 32px 0",
    border: "1px solid #eceff1",
    backgroundColor: "white"
    // height: "80px"
  },
  userSidebar: {
    border: "1px solid #eceff1",
    backgroundColor: "white",
    minWidth: "300px",
    padding: "20px"
    // height: "40px"
  },

  userSection: {
    display: "flex",
    margin: "20px",
    backgroundColor: "#eceff1",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
  }
});

class _User extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        <div className={classes.userSection}>
          <div className={classes.userSidebar}>
            <div>User Details</div>
            <div>
              <Link href="/orders">
                <Button>My orders</Button>
              </Link>
            </div>
          </div>
          <div className={classes.userInformation}>
            <PersonalInformation />
            <Email />
            <Phonenumber />
            <FAQS />
            <div></div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const User = withStyles(userStyles)(_User);

export default User;
