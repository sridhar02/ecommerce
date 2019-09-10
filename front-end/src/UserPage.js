import React, { Component, Fragment } from "react";

import { Navbar } from "./utils";

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
            <h3>
              Personal information
              <button> edit</button>
            </h3>
            <div>
              <div className="gender">
                Your Gender
                <div>
                  <input type="radio" name="gender" value="male" />{" "}
                  <label>male</label>
                </div>
                <div>
                  <input type="radio" name="gender" value="Female" />{" "}
                  <label>Female</label>
                </div>
              </div>
              <div>
                <div className="email-edit">
                  <h3>Email Adresss</h3>
                  <button>edit</button> <button>change password</button>
                </div>
                <input />
              </div>
              <div>
                <div className="Mobilenumber-edit">
                  <h3>Mobile Number</h3>
                  <button>edit</button>
                </div>
                <input />
              </div>
              <h4>FAQs</h4>
              <br />
              <p>
                What happens when I update my email address (or mobile number)?
                Your login email id (or mobile number) changes, likewise. You'll
                receive all your account related communication on your updated
                email address (or mobile number).
              </p>{" "}
              <br />
              <p>
                When will my Flipkart account be updated with the new email
                address (or mobile number)?It happens as soon as you confirm the
                verification code sent to your email (or mobile) and save the
                changes.
              </p>
              <br />
              <p>
                What happens to my existing Flipkart account when I update my
                email address (or mobile number)? Updating your email address
                (or mobile number) doesn't invalidate your account. Your account
                remains fully functional. You'll continue seeing your Order
                history, saved information and personal details.
              </p>
              <br />
              <p>
                Does my Seller account get affected when I update my email
                address? Flipkart has a 'single sign-on' policy. Any changes
                will reflect in your Seller account also.
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
