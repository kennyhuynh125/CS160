import React, {Component} from 'react';
import { Container, Collapse, Button, CardBody, Card, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseCard: false,
            collapseAddr: false,
            savedCards: 'No card saved',
            savedAddresses: 'No addresses saved',
        }
        this.toggleCard = this.toggleCard.bind(this);
        this.toggleAddr = this.toggleAddr.bind(this);
    }

    toggleCard() {
        this.setState({ collapseCard: !this.state.collapseCard });
    }

    addCard = (e) => {}
    handleNameChange = (e) => {}
    handleCardTypeChange = (e) => {}
    handleCardNumChange = (e) => {}
    handleExpMonthChange = (e) => {}
    handleExpYearChange = (e) => {}

    toggleAddr() {
        this.setState({ collapseAddr: !this.state.collapseAddr });
    }

    addAddress = (e) => {}
    handleStreetChange = (e) => {}
    handleAptNumChange = (e) => {}
    handleCityChange = (e) => {}
    handleStateChange = (e) => {}
    handleCountryChange = (e) => {}


    render() {
        return (
            <Container>
                <h2>Payment Information</h2>
                <h5>Saved Cards</h5>
                {this.state.savedCards}
                <p><Button onClick={this.toggleCard} style={{ marginBottom: '1rem' }}>Add New Card</Button>
                    <Collapse isOpen={this.state.collapseCard}>
                    <Card>
                        <CardBody>
                        <Form>
                            <FormGroup onSubmit={this.addCard}>
                                <Label for="Name">Name</Label>
                                <Input type="text" name="name" id="name" onChange={this.handleNameChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="ccnum">Credit Card Type</Label>
                                <p><Input type="select" name="cctype" id="cctype" onChange={this.handleCardTypeChange}>
                                    <option value="visa">Visa</option>
                                    <option value="mastercard">MasterCard</option>
                                    <option value="amex">American Express</option>
                                    <option value="discover">Discover</option>
                                </Input></p>
                            </FormGroup>
                            <FormGroup>
                                <Label for="ccnum">Credit Card Number</Label>
                                <Input type="password" name="ccnum" id="ccnum" onChange={this.handleCardNumChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="expdate">Expiration Date</Label>
                                <p><Input type="select" name="exmonth" id="expmonth" onChange={this.handleExpMonthChange}>
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
                                <Input type="select" name="expyear" id="expyear" onChange={this.handleExpYearChange}>
                                    <option value="18">2018</option>
                                    <option value="19">2019</option>
                                    <option value="20">2020</option>
                                    <option value="21">2021</option>
                                    <option value="22">2022</option>
                                    <option value="23">2023</option>
                                    <option value="24">2024</option>
                                </Input></p>
                            </FormGroup>
                            <Button>Submit</Button>
                        </Form>
                        </CardBody>
                    </Card>
                </Collapse></p>
                <h5>Billing Address</h5>
                {this.state.savedAddresses}
                <p><Button onClick={this.toggleAddr} style={{ marginBottom: '1rem' }}>Add New Address</Button>
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
                </Collapse></p>
            </Container>
        );
    }
}
