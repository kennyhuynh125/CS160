import React, {Component} from 'react';
import { Container, Collapse, Button, CardBody, Card, Form, FormGroup, Label, Input, Col, Row, Table } from 'reactstrap';
//import Editable from 'react-x-editable';

//this is not fully functional - updated values are edited live in the table and the database is not updated
export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'E-mail',
            phone: 'Phone',
            collapseCard: false,
        }
    }


    // changes the firstname state to what the user inputs
    handleFirstNameChange = (e) => {
        this.setState({
            firstName: e.target.value,
        })
    }

    // changes the lastname state to what the user inputs
    handleLastNameChange = (e) => {
        this.setState({
            lastName: e.target.value,
        })
    }

    // changes the email state to what the user inputs
    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        })
    }

    // changes the phone number state to what the user inputs
    handlePhoneChange = (e) => {
        this.setState({
            phone: e.target.value,
        })
    }

    toggleCard = () => {
        this.setState({ collapseCard: !this.state.collapseCard });
    }


    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        return (
            <Container>
            {
                isLoggedIn && (
                <div>
                    <br/><h2>Account Settings</h2>
                    <br/><Table bordered>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>E-mail</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.firstName}</td>
                                <td>{this.state.lastName}</td>
                                <td>{this.state.email}</td>
                                <td>{this.state.phone}</td>
                            </tr>
                        </tbody>
                    </Table>
                <p/><Button onClick={this.toggleCard} style={{ marginBottom: '1rem' }} color="info">Update Information</Button>
                                <Collapse isOpen={this.state.collapseCard}>
                                <Card>
                                    <CardBody>
                                    <Form onSubmit={this.updateInfo}>
                                        <Row form><Col md={3}>
                                            <FormGroup onSubmit={this.updateInfo}>
                                                <Label for="First Name">Name</Label>
                                                <Input type="text" name="firstname" id="firstname" onChange={this.handleFirstNameChange} />
                                            </FormGroup>
                                        </Col><Col md={3}>
                                            <FormGroup onSubmit={this.updateInfo}>
                                                <Label for="Last Name">Last Name</Label>
                                                <Input type="text" name="lastname" id="lastname" onChange={this.handleLastNameChange} />
                                            </FormGroup>
                                        </Col><Col md={3}>
                                            <FormGroup onSubmit={this.updateInfo}>
                                                <Label for="E-mail">E-mail</Label>
                                                <Input type="email" name="email" id="email" onChange={this.handleEmailChange} />
                                            </FormGroup>
                                        </Col><Col md={3}>
                                            <FormGroup onSubmit={this.updateInfo}>
                                                <Label for="Phone Number">Phone Number</Label>
                                                <Input type="text" name="number" id="number" onChange={this.handlePhoneChange} pattern="[0-9]{7,10}"/>
                                            </FormGroup>
                                        </Col></Row>
                                        <Button color="info">Submit Updates</Button>
                                    </Form>
                                    </CardBody>
                                </Card>
                            </Collapse><hr/>

                            <p/><h5><a href="/">Ride History</a></h5>
                            <h5><a href="/">Change Password</a></h5>
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
