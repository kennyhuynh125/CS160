import React, { Component } from 'react';
import {
  Container,
  Collapse,
  Button,
  CardBody,
  Card,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
} from 'reactstrap';
import axios from 'axios';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      collapseCard: false,
      currentFirstName: '',
      currentLastName: '',
      currentEmail: '',
    };
  }

  componentDidMount() {
    const userId = sessionStorage.getItem('userId');
    axios
      .post('/api/getuserinfo', {
        userId,
      })
      .then(response => {
        if (response.data.length !== 0) {
          this.setState({
            firstName:
              response.data[0].firstName !== null
                ? response.data[0].firstName
                : '',
            currentFirstName:
              response.data[0].firstName !== null
                ? response.data[0].firstName
                : '',
            lastName:
              response.data[0].lastName !== null
                ? response.data[0].lastName
                : '',
            currentLastName:
              response.data[0].lastName !== null
                ? response.data[0].lastName
                : '',
            email:
              response.data[0].email !== null ? response.data[0].email : '',
            currentEmail:
              response.data[0].email !== null ? response.data[0].email : '',
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  // changes the firstname state to what the user inputs
  handleFirstNameChange = e => {
    this.setState({
      firstName: e.target.value,
    });
  };

  // changes the lastname state to what the user inputs
  handleLastNameChange = e => {
    this.setState({
      lastName: e.target.value,
    });
  };

  // changes the email state to what the user inputs
  handleEmailChange = e => {
    this.setState({
      email: e.target.value,
    });
  };

  toggleCard = () => {
    this.setState({ collapseCard: !this.state.collapseCard });
  };

  updateFirstName = event => {
    event.preventDefault();
    if (
      this.state.firstName.toLowerCase() ===
      this.state.currentFirstName.toLowerCase()
    ) {
      alert('No changes made.');
      return;
    }
    const userId = sessionStorage.getItem('userId');
    axios
      .post('/api/updatefirstname', {
        userId,
        firstName: this.state.firstName,
      })
      .then(response => {
        if (response.data === true) {
          alert('First name updated.');
          this.setState({
            currentFirstName: this.state.firstName,
          });
        } else {
          alert('Error: Could not update information.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateLastName = event => {
    event.preventDefault();
    if (
      this.state.lastName.toLowerCase() ===
      this.state.currentLastName.toLowerCase()
    ) {
      alert('No changes made.');
      return;
    }
    const userId = sessionStorage.getItem('userId');
    axios
      .post('/api/updatelastname', {
        userId,
        lastName: this.state.lastName,
      })
      .then(response => {
        if (response.data === true) {
          alert('Last name updated.');
          this.setState({
            currentLastName: this.state.lastName,
          });
        } else {
          alert('Error: Could not update information.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateEmail = event => {
    event.preventDefault();
    if (
      this.state.email.toLowerCase() === this.state.currentEmail.toLowerCase()
    ) {
      alert('No changes made.');
      return;
    }
    const userId = sessionStorage.getItem('userId');
    axios
      .post('/api/updateemail', {
        userId,
        email: this.state.email,
      })
      .then(response => {
        if (response.data === true) {
          alert('Email updated.');
          this.setState({
            currentEmail: this.state.email,
          });
        } else {
          alert('Error: Could not update information.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    console.log(this.state);
    return (
      <Container>
        {isLoggedIn && (
          <div>
            <br />
            <h2>Account Settings</h2>
            <p>
              NOTE: The information is optional and all does not need to be
              filled
            </p>
            <br />
            <Table bordered>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.currentFirstName}</td>
                  <td>{this.state.currentLastName}</td>
                  <td>{this.state.currentEmail}</td>
                </tr>
              </tbody>
            </Table>
            <Button
              onClick={this.toggleCard}
              style={{ marginBottom: '1rem' }}
              color="info"
            >
              Update Information
            </Button>
            <Collapse isOpen={this.state.collapseCard}>
              <Card>
                <CardBody>
                  <Form onSubmit={this.updateFirstName}>
                    <FormGroup>
                      <Label for="First Name">Name</Label>
                      <Input
                        type="text"
                        name="firstname"
                        id="firstname"
                        onChange={this.handleFirstNameChange}
                        value={this.state.firstName}
                      />
                      <Button color="info">Change First Name</Button>
                    </FormGroup>
                  </Form>
                  <Form onSubmit={this.updateLastName}>
                    <FormGroup>
                      <Label for="Last Name">Last Name</Label>
                      <Input
                        type="text"
                        name="lastname"
                        id="lastname"
                        onChange={this.handleLastNameChange}
                        value={this.state.lastName}
                      />
                      <Button color="info">Change Last Name</Button>
                    </FormGroup>
                  </Form>
                  <Form onSubmit={this.updateEmail}>
                    <FormGroup>
                      <Label for="E-mail">E-mail</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        onChange={this.handleEmailChange}
                        value={this.state.email}
                      />
                      <Button color="info">Change Email</Button>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Collapse>
          </div>
        )}
        {!isLoggedIn && <div>You must be logged in to access this page!</div>}
      </Container>
    );
  }
}
