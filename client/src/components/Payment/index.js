import React, {Component} from 'react';
import { Container, Collapse, Button, CardBody, Card, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

import CardInformation from '../CardInformation';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseCard: false,
            collapseAddr: false,
            savedAddresses: 'No addresses saved',
            ccName: '',
            ccCardType: '',
            ccCardNum: '',
            ccExpMonth: '',
            ccExpYear: '',
            ccCVV: '',
            savedCards: [],
        }
    }

    componentDidMount() {
        const userId = sessionStorage.getItem('userId');
        axios.get(`/api/getcards/${userId}`)
        .then((response) => {
            this.setState({
                savedCards: response.data,
            });
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    toggleCard = () => {
        this.setState({ collapseCard: !this.state.collapseCard });
    }

    // adds card to database and refreshes page to show new change
    addCard = (e) => {
        const userId = sessionStorage.getItem('userId');
        axios.post('/api/addcard', {
            userId: userId,
            ccName: this.state.ccName,
            ccType: this.state.ccCardType,
            ccNumber: this.state.ccCardNum,
            ccExpirationMonth: this.state.ccExpMonth,
            ccExpirationYear: this.state.ccExpYear,
            ccCVV: this.state.ccCVV,
        })
        .then((response) => {
            console.log(response);
            if(response.data === true) {
                alert('Card successfully added');
                window.location.reload();
            } else {
                alert('Field(s) may contain invalid input.');
            }
        })
        .catch((error) => {
            console.log(error);
        })
        e.preventDefault();
    }

    // changes ccName state to user input
    handleNameChange = (e) => {
        this.setState({ ccName: e.target.value });
    }

    // changes ccCardType state to user input
    handleCardTypeChange = (e) => {
        this.setState({ ccCardType: e.target.value });
    }

    // changes ccCardNum state to user input
    handleCardNumChange = (e) => {
        this.setState({ ccCardNum: e.target.value });
    }

    // changes ccCardCode state to user input and parses to integer
    handleCardCodeChange = (e) => {
        this.setState({ ccCVV: parseInt(e.target.value, 10) });
    }

    // changes ccExpMonth state to user input and parses to integer
    handleExpMonthChange = (e) => {
        this.setState({ ccExpMonth: parseInt(e.target.value, 10) });
    }

     // changes ccExpYear state to user input and parses to integer
    handleExpYearChange = (e) => {
        this.setState({ccExpYear: parseInt(e.target.value, 10) });
    }

    toggleAddr = () => {
        this.setState({ collapseAddr: !this.state.collapseAddr });
    }

    addAddress = (e) => {}
    handleStreetChange = (e) => {}
    handleAptNumChange = (e) => {}
    handleCityChange = (e) => {}
    handleStateChange = (e) => {}
    handleCountryChange = (e) => {}


    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        console.log(this.state);
        return (
            <Container>
                {
                    isLoggedIn && (
                        <div>
                        <h2>Payment Information</h2>
                            <h5>Saved Cards</h5>
                            <CardInformation cards={this.state.savedCards} />
                            <Button onClick={this.toggleCard} style={{ marginBottom: '1rem' }}>Add New Card</Button>
                                <Collapse isOpen={this.state.collapseCard}>
                                <Card>
                                    <CardBody>
                                    <Form onSubmit={this.addCard}>
                                        <FormGroup onSubmit={this.addCard}>
                                            <Label for="Name">Name</Label>
                                            <Input type="text" name="name" id="name" onChange={this.handleNameChange} required />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ccnum">Credit Card Type</Label>
                                            <Input type="select" name="cctype" id="cctype" onChange={this.handleCardTypeChange} required>
                                                <option value="">None</option>
                                                <option value="visa">Visa</option>
                                                <option value="mastercard">MasterCard</option>
                                                <option value="amex">American Express</option>
                                                <option value="discover">Discover</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ccnum">Credit Card Number (15 - 19 digits)</Label>
                                            <Input pattern=".{15,19}" type="password" name="ccnum" id="ccnum" onChange={this.handleCardNumChange} required />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="cccvv">Credit Card CVV</Label>
                                            <Input type="number" name="cccvv" id="cccvv" onChange={this.handleCardCodeChange} required />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="expdate">Expiration Date</Label>
                                            <Input type="select" name="exmonth" id="expmonth" onChange={this.handleExpMonthChange} required>
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
                                            <Input type="select" name="expyear" id="expyear" onChange={this.handleExpYearChange} required>
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
                                        <Button>Submit</Button>
                                    </Form>
                                    </CardBody>
                                </Card>
                            </Collapse>
                            <h5>Billing Address</h5>
                            {this.state.savedAddresses}
                            <Button onClick={this.toggleAddr} style={{ marginBottom: '1rem' }}>Add New Address</Button>
                                <Collapse isOpen={this.state.collapseAddr}>
                                <Card>
                                    <CardBody>
                                    <Form>
                                        <FormGroup onSubmit={this.addAddress}>
                                            <Label for="street">Street</Label>
                                            <Input type="text" name="street" id="street" onChange={this.handleStreetChange} required />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="aptno">Apartment Number</Label>
                                            <Input type="text" name="aptno" id="aptno" onChange={this.handleAptNumChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="city">City</Label>
                                            <Input type="text" name="city" id="city" onChange={this.handleCityChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="state">State</Label>
                                            <Input type="select" name="state" id="state" onChange={this.handleStateChange}>
                                                <option value="CA">CA</option>
                                                <option value="x">other states here</option>
                                            </Input>
                                            <Label for="country">Country</Label>
                                            <Input type="select" name="country" id="country" onChange={this.handleCountryChange}>
                                                <option value="USA">USA</option>
                                            </Input>
                                        </FormGroup>
                                        <Button>Submit</Button>
                                    </Form>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </div>
                    )
                }
                {
                    !isLoggedIn && (
                        <div>You must be logged in to access this page!</div>
                    )
                }
            </Container>
        );
    }
}
