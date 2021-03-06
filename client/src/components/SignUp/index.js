import React, { Component } from 'react';
import { Container, Button, Form } from 'reactstrap';
import axios from 'axios';

import StyledAlert from '../Reusable/StyledAlert';
import StyledInput from '../Reusable/StyledInput';
import { SPACER } from '../../constants';
/*
This component renders the form for users to sign up for an account.
Form contains field for username and password.
*/
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      signUpError: false,
    };
  }

  // changes the password state to what the user inpus
  handlePasswordChange = e => {
    this.setState({
      password: e.target.value,
    });
  };

  // changes the username state to what the user inputs;
  handleUsernameChange = e => {
    this.setState({
      username: e.target.value,
    });
  };

  // checks if username is in db already and alert that it is taken
  // if not, adds new user to db and redirects to log in page.
  signUp = e => {
    e.preventDefault();

    if (this.state.username.length < 5) {
      alert('Username must be at least 5 characters long.');
      return;
    }

    if (/[^a-zA-Z0-9_-]/.test(this.state.username)) {
      alert('Only a-z, A-Z, 0-9, - and _ allowed in usernames.');
      return;
    }

    axios
      .post(`/api/createuser`, {
        username: this.state.username,
        password: this.state.password,
      })
      .then(response => {
        // our api will return True if it can successfully sign someone up
        // alert user and send them to login page
        if (response.data === true) {
          alert('Thank you for signing up. You may now log in.');
          this.props.history.push('/login');
        } else {
          this.setState({
            signUpError: true,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    e.preventDefault();
  };

  render() {
    return (
      <Container>
        <center>
          <div style={{ width: '50%' }}>
            <br />
            <h1>Sign Up</h1>
            <Form onSubmit={this.signUp}>
              <StyledInput
                fieldName="username"
                labelText="Username"
                fieldType="text"
                changeFunction={this.handleUsernameChange}
              />
              <div style={SPACER} />
              {this.state.signUpError && (
                <StyledAlert
                  color="warning"
                  message="This username is taken. Please try another one."
                />
              )}
              <StyledInput
                fieldName="password"
                labelText="Password"
                fieldType="password"
                changeFunction={this.handlePasswordChange}
              />
              <div style={SPACER} />
              <Button color="info" block>
                Sign Up
              </Button>
            </Form>
            <p />
            Have an account? <a href="/login">Log in</a>
          </div>
        </center>
      </Container>
    );
  }
}

export default SignUp;
