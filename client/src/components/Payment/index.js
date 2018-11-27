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
  Col,
  Row,
} from 'reactstrap';
import axios from 'axios';

import CardInformation from '../CardInformation';
import SavedAddresses from '../SavedAddresses';

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseCard: false,
      collapseAddr: false,
      ccName: '',
      ccCardType: '',
      ccCardNum: '',
      ccExpMonth: '',
      ccExpYear: '',
      ccCVV: '',
      savedCards: [],
      savedAddresses: [],
      firstName: '',
      lastName: '',
      street: '',
      aptNo: null,
      city: '',
      state: '',
      country: '',
      zip: '',
    };
  }

  componentDidMount() {
    const userId = sessionStorage.getItem('userId');
    axios
      .get(`/api/getcards/${userId}`)
      .then(response => {
        this.setState({
          savedCards: response.data,
        });
      })
      .catch(error => {
        console.log(error.message);
      });

    axios
      .get(`/api/getaddresses/${userId}`)
      .then(response => {
        this.setState({
          savedAddresses: response.data,
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  toggleCard = () => {
    this.setState({ collapseCard: !this.state.collapseCard });
  };

  // adds card to database and refreshes page to show new change
  addCard = e => {
    const userId = sessionStorage.getItem('userId');
    axios
      .post('/api/addcard', {
        userId,
        ccName: this.state.ccName,
        ccType: this.state.ccCardType,
        ccNumber: this.state.ccCardNum,
        ccExpirationMonth: this.state.ccExpMonth,
        ccExpirationYear: this.state.ccExpYear,
        ccCVV: this.state.ccCVV,
      })
      .then(response => {
        console.log(response);
        if (response.data === true) {
          alert('Card successfully added');
          window.location.reload();
        } else {
          alert('Field(s) may contain invalid input.');
        }
      })
      .catch(error => {
        console.log(error);
      });
    e.preventDefault();
  };

  // changes ccName state to user input
  handleNameChange = e => {
    this.setState({ ccName: e.target.value });
  };

  // changes ccCardType state to user input
  handleCardTypeChange = e => {
    this.setState({ ccCardType: e.target.value });
  };

  // changes ccCardNum state to user input
  handleCardNumChange = e => {
    this.setState({ ccCardNum: e.target.value });
  };

  // changes ccCardCode state to user input and parses to integer
  handleCardCodeChange = e => {
    this.setState({ ccCVV: parseInt(e.target.value, 10) });
  };

  // changes ccExpMonth state to user input and parses to integer
  handleExpMonthChange = e => {
    this.setState({ ccExpMonth: parseInt(e.target.value, 10) });
  };

  // changes ccExpYear state to user input and parses to integer
  handleExpYearChange = e => {
    this.setState({ ccExpYear: parseInt(e.target.value, 10) });
  };

  toggleAddr = () => {
    this.setState({ collapseAddr: !this.state.collapseAddr });
  };

  addAddress = e => {
    const userId = sessionStorage.getItem('userId');
    axios
      .post('/api/addaddress', {
        userId,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        street: this.state.street,
        aptNo: this.state.aptNo,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        zipCode: this.state.zip,
      })
      .then(response => {
        console.log(response);
        if (response.data === true) {
          alert('Address successfully added');
          window.location.reload();
        } else {
          alert('Field(s) may contain invalid input.');
        }
      })
      .catch(error => {
        console.log(error);
      });
    e.preventDefault();
  };

  handleFirstNameChange = e => {
    this.setState({ firstName: e.target.value });
  };

  handleLastNameChange = e => {
    this.setState({ lastName: e.target.value });
  };

  handleStreetChange = e => {
    this.setState({ street: e.target.value });
  };

  handleAptNumChange = e => {
    this.setState({ aptNo: e.target.value });
  };

  handleCityChange = e => {
    this.setState({ city: e.target.value });
  };

  handleStateChange = e => {
    this.setState({ state: e.target.value });
  };

  handleCountryChange = e => {
    this.setState({ country: e.target.value });
  };

  handleZipChange = e => {
    this.setState({ zip: e.target.value });
  };

  render() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    console.log(this.state);
    return (
      <Container>
        {isLoggedIn && (
          <div>
            <br />
            <h2>Payment Information</h2>
            <br />
            <h5>Saved Cards</h5>
            <CardInformation cards={this.state.savedCards} />
            <p />
            <Button
              onClick={this.toggleCard}
              style={{ marginBottom: '1rem' }}
              color="info"
            >
              Add New Card
            </Button>
            <Collapse isOpen={this.state.collapseCard}>
              <Card>
                <CardBody>
                  <Form onSubmit={this.addCard}>
                    <Row form>
                      <Col md={9}>
                        <FormGroup onSubmit={this.addCard}>
                          <Label for="Name">Name</Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            onChange={this.handleNameChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="ccnum">Credit Card Type</Label>
                          <Input
                            type="select"
                            name="cctype"
                            id="cctype"
                            onChange={this.handleCardTypeChange}
                            required
                          >
                            <option value="">None</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">MasterCard</option>
                            <option value="amex">American Express</option>
                            <option value="discover">Discover</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <Label for="ccnum">
                        Credit Card Number (15 - 19 digits)
                      </Label>
                      <Input
                        pattern=".{15,19}"
                        type="password"
                        name="ccnum"
                        id="ccnum"
                        onChange={this.handleCardNumChange}
                        required
                      />
                    </FormGroup>
                    <Row form>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="cccvv">Credit Card CVV</Label>
                          <Input
                            type="number"
                            name="cccvv"
                            id="cccvv"
                            onChange={this.handleCardCodeChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="expdate">Expiration Date</Label>
                          <Input
                            type="select"
                            name="exmonth"
                            id="expmonth"
                            onChange={this.handleExpMonthChange}
                            required
                          >
                            <option value="">None</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="expdate">Year</Label>
                          <Input
                            type="select"
                            name="expyear"
                            id="expyear"
                            onChange={this.handleExpYearChange}
                            required
                          >
                            <option value="">None</option>
                            <option value="18">2018</option>
                            <option value="19">2019</option>
                            <option value="20">2020</option>
                            <option value="21">2021</option>
                            <option value="22">2022</option>
                            <option value="23">2023</option>
                            <option value="24">2024</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="info">Submit</Button>
                  </Form>
                </CardBody>
              </Card>
            </Collapse>
            <hr />
            <h5>Billing Address</h5>
            <SavedAddresses addresses={this.state.savedAddresses} />
            <p />
            <Button
              onClick={this.toggleAddr}
              style={{ marginBottom: '1rem' }}
              color="info"
            >
              Add New Address
            </Button>
            <Collapse isOpen={this.state.collapseAddr}>
              <Card>
                <CardBody>
                  <Form onSubmit={this.addAddress}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="firstName">First Name</Label>
                          <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            onChange={this.handleFirstNameChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="lastName">Last Name</Label>
                          <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            onChange={this.handleLastNameChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={8}>
                        <FormGroup>
                          <Label for="street">Street</Label>
                          <Input
                            type="text"
                            name="street"
                            id="street"
                            onChange={this.handleStreetChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="aptNo">Apartment Number</Label>
                          <Input
                            type="text"
                            name="aptNo"
                            id="aptNo"
                            onChange={this.handleAptNumChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={5}>
                        <FormGroup>
                          <Label for="city">City</Label>
                          <Input
                            type="text"
                            name="city"
                            id="city"
                            onChange={this.handleCityChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label for="state">State</Label>
                          <Input
                            type="select"
                            name="state"
                            id="state"
                            onChange={this.handleStateChange}
                            required
                          >
                            <option value="default">Select State</option>
                            <option value="CA">CA</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="country">Country</Label>
                          <Input
                            type="select"
                            name="country"
                            id="country"
                            onChange={this.handleCountryChange}
                            required
                          >
                            <option value="default">Select Country</option>
                            <option value="USA">USA</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label for="zip">Zip Code</Label>
                          <Input
                            type="number"
                            name="zip"
                            id="zip"
                            onChange={this.handleZipChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="info">Submit</Button>
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
