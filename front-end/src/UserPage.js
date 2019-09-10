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
    personalInformation: {
      display: "flex"
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
    fetch("http://localhost:8000/user", {
      method: "PUT",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      },
      body: JSON.stringify({
        name: this.state.name,
        sex: this.state.sex
      })
    }).then(response => {
      if (response.status === 204) {
        this.setState({
          disabled: true
        });
      }
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
          </Button>
          <Button color="primary" type="submit">
            Save
          </Button>{" "}
        </Fragment>
      );
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={classes.personalInformation}>
          <Typography variant="h5">Personal information</Typography>
          {buttons}
        </div>
        <div>
          <TextField
            id="outlined-name"
            label="Name"
            name="name"
            className={classes.textField}
            placeholder="Enter Name"
            value={this.state.name}
            onChange={this.handleChange}
            margin="normal"
            disabled={disabled}
            variant="outlined"
          />
          <div className="gender">
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

const emailStyles = {};

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
    fetch("http://localhost:8000/user", {
      method: "PUT",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      },
      body: JSON.stringify({
        email: this.state.email
      })
    }).then(response => {
      if (response.status === 204) {
        this.setState({
          disabled: true
        });
      }
    });
  };

  handleEdit = () => {
    this.setState({
      disabled: false
    });
  };

  render() {
    const { disabled } = this.state;
    let buttons;
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
          <Button color="primary" type="submit">
            Save
          </Button>
          <Button color="primary">change password</Button>
        </Fragment>
      );
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="email-edit">
          <Typography variant="h5">Email Adresss</Typography>
          {buttons}
        </div>
        <TextField
          id="outlined-name"
          label="Email"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          disabled={disabled}
          placeholder=" Enter Email Adress"
          margin="normal"
          variant="outlined"
        />
      </form>
    );
  }
}

const Email = withStyles(emailStyles)(_Email);

class Phonenumber extends Component {
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
    fetch("http://localhost:8000/user", {
      method: "PUT",
      headers: {
        Accept: "applicaton/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("secret")}`
      },
      body: JSON.stringify({
        phonenumber: this.state.phonenumber
      })
    }).then(response => {
      if (response.status === 204) {
        this.setState({
          disabled: true
        });
      }
    });
  };

  handleEdit = () => {
    this.setState({
      disabled: false
    });
  };

  render() {
    const { disabled } = this.state;
    let buttons;
    if (disabled === true) {
      buttons = (
        <Button color="primary" onClick={this.handleEdit}>
          edit
        </Button>
      );
    } else {
      buttons = (
        <Button color="primary" type="submit">
          Save
        </Button>
      );
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="Mobilenumber-edit">
          <Typography variant="h5">Mobile Number</Typography>
          {buttons}
        </div>
        <TextField
          id="outlined-name"
          label="Phonenumber"
          value={this.state.email}
          onChange={this.handleChange}
          disabled={disabled}
          placeholder=" Enter Phonenumber"
          margin="normal"
          variant="outlined"
        />
      </form>
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
